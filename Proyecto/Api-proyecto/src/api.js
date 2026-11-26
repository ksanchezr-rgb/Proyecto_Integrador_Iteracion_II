require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const rutaNoEncontrada = require('./middlewares/rutaNoEncontrada');
const manejarErrores = require('./middlewares/manejarErrores');

const app = express();

// 1. Permite las peticiones del frontend.
app.use(cors({
    origin: process.env.ORIGEN_FRONTEND,
    credentials: true
}));

// 2. Lee los datos en formato JSON.
app.use(express.json());

// 3. Ruta de prueba.
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'API de Desarrollo Curricular funcionando'
    });
});

// 5. Manejo de errores.
app.use(rutaNoEncontrada);
app.use(manejarErrores);

// 6. Inicia el servidor.
const puerto = process.env.PORT || 4000;

app.listen(puerto, () => {
    console.log(`API en http://localhost:${puerto}`);
});