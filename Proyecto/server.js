// Servidor del frontend: entrega los archivos HTML, CSS, JS e imágenes de public.
const path = require('path');
const express = require('express');

const app = express();

// El navegador puede acceder únicamente a los archivos de esta carpeta.
app.use(express.static(path.join(__dirname, 'public')));

// En producción se respeta PORT; en desarrollo se utiliza el puerto 3000.
const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
    console.log(`Frontend en http://localhost:${puerto}`);
});
