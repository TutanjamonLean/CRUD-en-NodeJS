# Express TP CRUD - Cafetería del CRUI

API REST para gestionar productos de la cafetería del CRUI, desarrollada con Node.js y Express.

## 📋 Requisitos previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd express-tp-crud
```

2. Instalar dependencias:
```bash
npm install
```

## ▶️ Ejecución

Iniciar el servidor:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

> **Nota:** Para desarrollo, puedes usar `npx nodemon index.js` si instalas nodemon como dependencia de desarrollo (`npm install -D nodemon`).

## 📡 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Mensaje de bienvenida |
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/:id` | Obtener un producto por ID |
| POST | `/api/productos` | Crear un nuevo producto |
| PUT | `/api/productos/:id` | Actualizar un producto existente |
| DELETE | `/api/productos/:id` | Eliminar un producto |

## 📝 Ejemplos de uso

### Listar todos los productos
```bash
curl http://localhost:3000/api/productos
```

### Obtener un producto por ID
```bash
curl http://localhost:3000/api/productos/1
```

### Crear un nuevo producto
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Croissant", "precio": 1500, "categoria": "comida"}'
```

### Actualizar un producto
```bash
curl -X PUT http://localhost:3000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Café con leche grande", "precio": 2200, "categoria": "bebida"}'
```

### Eliminar un producto
```bash
curl -X DELETE http://localhost:3000/api/productos/1
```

## ✅ Validaciones

- **nombre**: Obligatorio, string no vacío
- **precio**: Obligatorio, número mayor a 0 (no acepta strings)
- **categoria**: Opcional (por defecto: "sin categoría")

## 📊 Códigos de respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa (GET, PUT, DELETE) |
| 201 | Recurso creado exitosamente (POST) |
| 400 | Datos inválidos o ID no numérico |
| 404 | Producto no encontrado |

## 🧪 Pruebas realizadas

### ✅ Respuesta exitosa - GET /api/productos
```json
[
  {"id":1,"nombre":"Café con leche","precio":1800,"categoria":"bebida"},
  {"id":2,"nombre":"Medialuna","precio":900,"categoria":"comida"},
  {"id":3,"nombre":"Tostado de jamón y queso","precio":3500,"categoria":"comida"},
  {"id":4,"nombre":"Agua mineral","precio":1200,"categoria":"bebida"}
]
```

### ✅ Respuesta exitosa - POST /api/productos
```json
{"id":5,"nombre":"Croissant","precio":1500,"categoria":"comida"}
```

### ❌ Respuesta de error - POST con datos inválidos
```json
{"errores":["El nombre es obligatorio y no puede estar vacío","El precio debe ser un número mayor que cero"]}
```

### ❌ Respuesta de error - GET /api/productos/999
```json
{"error":"Producto no encontrado"}
```

## 📂 Estructura del proyecto

```
express-tp-crud/
├── index.js          # Servidor principal
├── package.json      # Configuración y dependencias
├── .gitignore        # Archivos ignorados por Git
└── README.md         # Este archivo
```

## 👨‍💻 Autor

Trabajo Práctico Individual - Prácticas Profesionalizantes I