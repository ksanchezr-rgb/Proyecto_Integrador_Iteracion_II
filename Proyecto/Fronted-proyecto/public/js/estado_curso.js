/* ===== CATÁLOGO DE ESTADOS DEL CURSO ===== */

let estados = [];

function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

async function cargarEstados() {
    try {
        const datos = await pedirApi('GET', '/estados-curso');

        estados = datos.map(estado => estado.nombre);

        listar();

    } catch (error) {
        document.getElementById('conteo').textContent =
            error.message;
    }
}

function listar() {
    const filtro = normalizar(
        document.getElementById('buscador').value.trim()
    );

    let html = '';
    let mostrados = 0;

    for (let i = 0; i < estados.length; i++) {
        const estado = estados[i];

        if (filtro !== '' && !normalizar(estado).includes(filtro)) {
            continue;
        }

        mostrados++;

        html += '<tr>' +
            '<td>' + estado.toUpperCase() + '</td>' +
        '</tr>';
    }

    if (mostrados === 0) {
        const mensaje = filtro === ''
            ? 'No hay estados para mostrar.'
            : 'No se encontraron estados con esa búsqueda.';

        html = '<tr><td class="vacio">' + mensaje + '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostrados + ' de ' + estados.length + ' estados';
}

document.getElementById('buscador').addEventListener('input', listar);

cargarEstados();