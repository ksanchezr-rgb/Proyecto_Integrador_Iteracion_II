
/* ===== CATÁLOGO DE CERTIFICACIONES ===== */

let certificaciones = [];
let editando = null; // null = registrando; número = editando esa posición

function esc(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Minúsculas y sin tildes, para facilitar la búsqueda
function normalizar(texto) {
    return String(texto??'')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    const caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

function listar() {
    const filtro = normalizar(
        document.getElementById('buscadorCertificaciones').value.trim()
    );

    let html = '';
    let mostradas = 0;

    for (let i = 0; i < certificaciones.length; i++) {
        const certificacion = certificaciones[i];

        const texto = normalizar(
            certificacion.codigo + ' ' +
            certificacion.nombre + ' ' +
            certificacion.descripcion
        );

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;

        html += '<tr>' +
            '<td class="codigo">' + esc(certificacion.codigo) + '</td>' +
            '<td>' + esc(certificacion.nombre) + '</td>' +
            '<td>' + esc(certificacion.descripcion) + '</td>' +
            '<td class="acciones">' +
                '<button type="button" class="btn_tabla" data-indice="' + i + '">' + 'EDITAR' + '</button>' +
                '<button type="button" class="btn_eliminar" data-indice="' + i + '">' + 'ELIMINAR' + '</button>' +
            '</td>' +
        '</tr>';
    }

    if (mostradas === 0) {
        const mensaje = certificaciones.length === 0
            ? 'No hay certificaciones para mostrar.'
            : 'No se encontraron certificaciones con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="3">' +
            mensaje +
        '</td></tr>';
    }

    document.getElementById('tablaCertificacionesBody').innerHTML = html;

    document.getElementById('conteo').textContent ='Mostrando ' + mostradas + ' de ' + certificaciones.length + ' certificaciones';
}

async function cargarCertificaciones() {
    try {
        certificaciones = await pedirApi('GET', '/certificaciones');
        listar();
    } catch (error) {
        aviso(error.message, 'error');
    }
}

function abrirFormulario() {
    editando = null;

    document.getElementById('titulo_formulario').textContent =
        'Registrar casa certificadora o certificación';

    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';

    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function editar(i) {
    if (i < 0 || i >= certificaciones.length) {
        return;
    }

    abrirFormulario();

    editando = i;

    document.getElementById('titulo_formulario').textContent =
        'Modificar casa certificadora o certificación';

    document.getElementById('codigo').value = certificaciones[i].codigo;
    document.getElementById('nombre').value = certificaciones[i].nombre;
    document.getElementById('descripcion').value = certificaciones[i].descripcion;

    // El código no se puede cambiar al editar
    document.getElementById('codigo').readOnly = true;

    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    editando = null;

    document.getElementById('panel_formulario').classList.add('oculto');
    document.getElementById('error_formulario').textContent = '';
}

async function guardarCertificacion(evento) {
    evento.preventDefault();

    const datos = ValidacionesCatalogos.validar(
        'certificaciones', certificaciones, editando
    );

    if (!datos) return;

    const certificacion = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion
    };

    try {
        let resultado;

        if (editando === null) {
            resultado = await pedirApi(
                'POST', '/certificaciones', certificacion
            );
        } else {
            const id = certificaciones[editando]._id;

            resultado = await pedirApi(
                'PUT', `/certificaciones/${id}`, certificacion
            );
        }

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarCertificaciones();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

async function eliminarCertificacion(certificacion) {

    if (!confirm(`¿Eliminar "${certificacion.nombre}"?`)) {
        return;
    }

    try {
        const resultado = await pedirApi(
            'DELETE', `/certificaciones/${certificacion._id}`
        );

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarCertificaciones();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

// Acciones
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarCertificacion);
document.getElementById('buscadorCertificaciones').addEventListener('input', listar);
document.getElementById('tablaCertificacionesBody')
    .addEventListener('click', function(evento) {

        const botonEditar = evento.target.closest('.btn_tabla');
        const botonEliminar = evento.target.closest('.btn_eliminar');

        if (botonEditar) {
            const indice = Number(botonEditar.dataset.indice);
            editar(indice);
        }

        if (botonEliminar) {
            const indice = Number(botonEliminar.dataset.indice);
            eliminarCertificacion(certificaciones[indice]);
        }
    });

cargarCertificaciones();