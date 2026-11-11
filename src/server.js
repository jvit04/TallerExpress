import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

const fotos = [
    { id: 1, titulo: 'Atardecer', calificacion: 4.5, descripcion: 'Plata de Montaíta' },
    { id: 2, titulo: 'Malecón', calificacion: 4.0, descripcion: 'Guayaquil de noche' }
];

// Logger middleware
app.use((req, res, next) => {
    const hora = new Date().toISOString();
    console.log(`${hora} ${req.method} ${req.url}`);
    next();
});

// GET: Obtener todas las fotos
app.get('/api/fotos', (req, res) => {
    res.json(fotos);
});

// GET: Obtener una foto por ID
app.get('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    const foto = fotos.find((f) => f.id === id);
    if (!foto) {
        return res.status(404).json({ mensaje: `Foto ${id} no encontrada` });
    }
    res.json(foto);
});

// POST: Crear una nueva foto
app.post('/api/fotos', (req, res) => {
    const { titulo, descripcion, calificacion } = req.body;
    if (!titulo) {
        return res.status(400).json({ mensaje: 'El titulo es obligatorio' });
    }
    const nueva = {
        id: fotos.length + 1,
        titulo,
        descripcion,
        calificacion,
    };
    fotos.push(nueva);
    res.status(201).json(nueva);
});

app.patch('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    const foto = fotos.find((f) => f.id === id);
    
    if (!foto) {
        return res.status(404).json({ mensaje: `Foto ${id} no encontrada` });
    }

    // Object.assign sobreescribe en 'foto' solo las propiedades que vengan en 'req.body'
    Object.assign(foto, req.body);
    
    res.json(foto);
});

app.delete('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    
    // Buscamos el índice de la foto
    const indice = fotos.findIndex((f) => f.id === id); 
    
    if (indice === -1) {
        return res.status(404).json({ mensaje: `Foto ${id} no encontrada` });
    }

    // Eliminamos 1 elemento en la posición del índice
    fotos.splice(indice, 1); 
    
    // Respondemos con status 204 y sin cuerpo[cite: 3]
    res.status(204).end(); 
});

// GET: Simular un error interno
app.get('/api/error', async (req, res) => {
    throw new Error('Algo salió mal');
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});