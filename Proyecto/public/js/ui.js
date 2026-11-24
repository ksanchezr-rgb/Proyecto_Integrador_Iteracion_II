// ui.js: muestra los mensajes de la API.

function mostrarMensaje(texto, tipo) {
    let mensaje = document.getElementById('mensaje');

    if (!mensaje) {
        mensaje = document.createElement('p');
        mensaje.id = 'mensaje';
        mensaje.setAttribute('role', 'status');

        const formulario = document.querySelector('form');

        if (formulario) {
            formulario.insertAdjacentElement('afterend', mensaje);
        }
    }

    if (mensaje) {
        mensaje.textContent = texto;
        mensaje.className = 'mensaje ' + tipo;
        mensaje.style.color = tipo === 'error' ? '#b42318' : '#167347';
    }
}