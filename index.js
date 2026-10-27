const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Datos iniciales
let productos = [
    { id: 1, nombre: 'Café con leche', precio: 1800, categoria: 'bebida' },
    { id: 2, nombre: 'Medialuna', precio: 900, categoria: 'comida' },
    { id: 3, nombre: 'Tostado de jamón y queso', precio: 3500, categoria: 'comida' },
    { id: 4, nombre: 'Agua mineral', precio: 1200, categoria: 'bebida' }
];

// Variable para auto-generar IDs
let nextId = 5;

// Función auxiliar para validar producto
function validarProducto(body) {
    const errores = [];
    
    if (!body.nombre || typeof body.nombre !== 'string' || body.nombre.trim() === '') {
        errores.push('El nombre es obligatorio y no puede estar vacío');
    }
    
    if (body.precio === undefined || body.precio === null) {
        errores.push('El precio es obligatorio');
    } else if (typeof body.precio !== 'number' || isNaN(body.precio) || body.precio <= 0) {
        errores.push('El precio debe ser un número mayor que cero');
    }
    
    return errores;
}

// RUTAS

// GET / - Mensaje de bienvenida
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de la Cafetería del CRUI!');
});

// GET /api/productos - Listar todos los productos
app.get('/api/productos', (req, res) => {
    res.status(200).json(productos);
});

// GET /api/productos/:id - Buscar producto por ID
app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }
    
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.status(200).json(producto);
});

// POST /api/productos - Crear nuevo producto
app.post('/api/productos', (req, res) => {
    const errores = validarProducto(req.body);
    
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    
    const nuevoProducto = {
        id: nextId++,
        nombre: req.body.nombre.trim(),
        precio: req.body.precio,
        categoria: req.body.categoria || 'sin categoría'
    };
    
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

// PUT /api/productos/:id - Modificar producto existente
app.put('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }
    
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    const errores = validarProducto(req.body);
    
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    
    // Actualizar producto (mantener el mismo ID)
    productos[index] = {
        ...productos[index],
        nombre: req.body.nombre.trim(),
        precio: req.body.precio,
        categoria: req.body.categoria || productos[index].categoria
    };
    
    res.status(200).json(productos[index]);
});

// DELETE /api/productos/:id - Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }
    
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    const eliminado = productos.splice(index, 1)[0];
    res.status(200).json({ mensaje: 'Producto eliminado correctamente', producto: eliminado });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});