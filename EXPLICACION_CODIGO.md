# Explicación del Diseño del Código

## 🏗️ Arquitectura General

El proyecto sigue una **arquitectura simple en capas** adecuada para una API REST pequeña sin base de datos:

```
┌─────────────────────────────────────┐
│           HTTP Request              │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│      Express Router (index.js)      │  ← Capa de presentación/rutas
│  - Define endpoints                 │
│  - Parsea req.params, req.body      │
│  - Llama a lógica de negocio        │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│      Lógica de Negocio (inline)     │  ← Capa de servicio
│  - Validaciones                     │
│  - Operaciones CRUD en array        │
│  - Generación de IDs                │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│      Almacenamiento en Memoria      │  ← Capa de datos
│  - Array `productos`                │
│  - Variable `nextId`                │
└─────────────────────────────────────┘
```

---

## 📂 Estructura de Archivos

| Archivo | Responsabilidad |
|---------|-----------------|
| `index.js` | Punto de entrada, configuración Express, rutas, lógica CRUD |
| `package.json` | Metadatos, dependencias, scripts de ejecución |
| `.gitignore` | Excluye `node_modules/`, logs, `.env` |
| `README.md` | Documentación para usuarios/desarrolladores |
| `EXPLICACION_CODIGO.md` | Este archivo: diseño técnico |

---

## 🔧 Decisiones de Diseño Clave

### 1. **Almacenamiento en Memoria (Array)**
```javascript
let productos = [ ... ];  // Datos iniciales
let nextId = 5;           // Contador para IDs auto-generados
```
- **Por qué**: El enunciado lo exige explícitamente ("No necesitás desarrollar una interfaz visual ni conectar una base de datos. Los datos se almacenarán en un array de JavaScript")
- **Trade-off**: Los datos se pierden al reiniciar el servidor (comportamiento esperado según punto 7)

### 2. **Validación Centralizada**
```javascript
function validarProducto(body) {
    const errores = [];
    // ... validaciones
    return errores;
}
```
- **Por qué**: Evita duplicación de código entre POST y PUT
- **Retorna array de strings**: Permite mostrar múltiples errores a la vez (mejor UX para el cliente)

### 3. **Manejo de IDs**
```javascript
const id = parseInt(req.params.id);
if (isNaN(id)) return res.status(400).json({ error: 'El ID debe ser un número válido' });
```
- **parseInt + isNaN**: Protege contra IDs no numéricos (`/api/productos/abc`)
- **Auto-incremental**: `nextId++` garantiza unicidad simple

### 4. **Códigos HTTP Semánticos**
| Situación | Código | Justificación |
|-----------|--------|---------------|
| Creación exitosa | 201 | Estándar REST para POST que crea recurso |
| Consulta/Modificación/Eliminación exitosa | 200 | Estándar para operaciones exitosas con respuesta |
| Datos inválidos | 400 | Bad Request - error del cliente |
| Recurso no encontrado | 404 | Not Found - recurso inexistente |

### 5. **Respuestas Consistentes en JSON**
```javascript
// Éxito
res.status(200).json(producto);
res.status(201).json(nuevoProducto);

// Error
res.status(400).json({ errores: [...] });
res.status(404).json({ error: 'Producto no encontrado' });
```
- **Formato uniforme**: Facilita consumo por clientes (Frontend, Postman, tests)
- **Objeto con clave `error`/`errores`**: Patrón común en APIs REST

### 6. **Middleware `express.json()`**
```javascript
app.use(express.json());
```
- **Necesario**: Para que `req.body` esté disponible en POST/PUT
- **Built-in**: Desde Express 4.16+, no requiere `body-parser` externo

---

## 🔄 Flujo de Cada Endpoint

### GET /api/productos
```
Request → Express → productos (array) → JSON Response (200)
```

### GET /api/productos/:id
```
Request → parseInt(id) → find() → existe? 
    ├─ Sí → JSON Response (200)
    └─ No → 404 { error }
```

### POST /api/productos
```
Request → validarProducto(body) → válido?
    ├─ Sí → crear { id: nextId++, ... } → push → JSON Response (201)
    └─ No → JSON Response (400) { errores }
```

### PUT /api/productos/:id
```
Request → parseInt(id) → findIndex() → existe?
    ├─ Sí → validarProducto(body) → válido?
    │       ├─ Sí → actualizar en array → JSON Response (200)
    │       └─ No → JSON Response (400) { errores }
    └─ No → JSON Response (404) { error }
```

### DELETE /api/productos/:id
```
Request → parseInt(id) → findIndex() → existe?
    ├─ Sí → splice() → JSON Response (200) { mensaje, producto }
    └─ No → JSON Response (404) { error }
```

---

## 🛡️ Consideraciones de Seguridad y Robustez

| Aspecto | Implementación |
|---------|----------------|
| **Inyección NoSQL/SQL** | N/A - sin base de datos |
| **Validación de tipos** | `typeof body.precio === 'number'` rechaza strings numéricos |
| **Trim en strings** | `nombre.trim()` evita nombres con solo espacios |
| **IDs únicos** | Contador simple `nextId` (suficiente para instancia única) |
| **Manejo de errores** | try/catch no necesario (operaciones síncronas simples) |

---

## 📈 Escalabilidad (Futuro)

Si el proyecto creciera, las mejoras naturales serían:

1. **Separar en módulos**:
   ```
   src/
   ├── routes/
   │   └── productos.js
   ├── controllers/
   │   └── productosController.js
   ├── services/
   │   └── productoService.js
   ├── middleware/
   │   └── validacion.js
   └── data/
       └── productos.js
   ```

2. **Base de datos real**: SQLite, MongoDB, PostgreSQL

3. **Validación con esquemas**: `joi` o `zod`

4. **Tests automatizados**: `jest` + `supertest`

5. **Variables de entorno**: `dotenv` para puerto, etc.

---

## 🎯 Cumplimiento de Requisitos del Enunciado

| Requisito | Implementado | Ubicación |
|-----------|--------------|-----------|
| Puerto 3000 | ✅ | `app.listen(3000)` |
| Array inicial con 4 productos | ✅ | `productos` en index.js |
| GET / | ✅ | `app.get('/')` |
| GET /api/productos | ✅ | `app.get('/api/productos')` |
| GET /api/productos/:id | ✅ | `app.get('/api/productos/:id')` |
| POST /api/productos | ✅ | `app.post('/api/productos')` |
| PUT /api/productos/:id | ✅ | `app.put('/api/productos/:id')` |
| DELETE /api/productos/:id | ✅ | `app.delete('/api/productos/:id')` |
| IDs auto-generados | ✅ | `nextId++` |
| Nombre obligatorio, no vacío | ✅ | `validarProducto()` |
| Precio número > 0 | ✅ | `validarProducto()` |
| 400 datos inválidos | ✅ | Validaciones |
| 404 no existe | ✅ | find/findIndex checks |
| 201 creación | ✅ | `res.status(201)` |
| 200 resto | ✅ | `res.status(200)` |
| Respuestas JSON | ✅ | `res.json()` |
| package.json | ✅ | Archivo raíz |
| .gitignore | ✅ | Excluye node_modules |
| README.md | ✅ | Con instrucciones y ejemplos |

---

