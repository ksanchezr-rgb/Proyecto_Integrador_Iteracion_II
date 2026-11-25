// api.js: el único archivo del frontend que se comunica con la API.
// El frontend está en el puerto 3000 y la API será otra aplicación en el 4000.
const URL_API = 'http://localhost:4000/api';

// Envía una petición a la API y devuelve los datos de la respuesta.
// metodo: 'GET', 'POST', 'PUT' o 'DELETE'
// ruta: por ejemplo '/escuelas'
// datos: el objeto que se envía con POST o PUT
async function pedirApi(metodo, ruta, datos) {
    // 1. Prepara las opciones de la petición.
    const opciones = { method: metodo, headers: {} };

    if (datos !== undefined) {
        opciones.headers['Content-Type'] = 'application/json';
        opciones.body = JSON.stringify(datos);
    }

    // 2. Envía la petición y espera la respuesta.
    let respuesta;
    try {
        respuesta = await fetch(URL_API + ruta, opciones);
    } catch (error) {
        throw new Error('No se pudo conectar con la API');
    }

    // 3. Convierte el cuerpo de la respuesta en un objeto.
    const contenido = await respuesta.json().catch(() => ({}));

    // 4. Si la API respondió con un error, lo lanza.
    if (!respuesta.ok) {
        const error = new Error(contenido.mensaje || 'Ocurrió un error');
        error.estado = respuesta.status;
        throw error;
    }

    return contenido;
}
