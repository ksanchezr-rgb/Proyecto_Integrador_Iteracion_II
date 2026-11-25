
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
                '<button type="button" class="btn_tabla" data-indice="' + i + '">' +
                    'EDITAR' +
                '</button>' +
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
        const respuesta = await pedirApi('GET', '/certificaciones');
        certificaciones = Array.isArray(respuesta)
            ? respuesta
            : (respuesta.certificaciones || respuesta.data || []);
        listar();
    } catch (error) {
        certificaciones = [];
        listar();
        aviso(error.message || 'No se pudieron cargar las certificaciones desde la API.', 'error');
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
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('error_formulario').textContent = '';
    const datos = ValidacionesCatalogos.validar('certificaciones', certificaciones, editando);
    if (!datos) return;
    const esNuevo = editando === null;

    const certificacion = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion
    };
    
    try {
            if (esNuevo) {
                await pedirApi('POST', '/certificaciones', certificacion);
            } else {
                const actual = certificaciones[editando];
                const idRegistro = actual._id || actual.id || actual.codigo;
                await pedirApi('PUT', '/certificaciones/' + encodeURIComponent(idRegistro), certificacion);
            }

            await cargarCertificaciones();
            cerrarFormulario();

            aviso(
                esNuevo
                    ? 'Certificación registrada correctamente.'
                    : 'Certificación modificada correctamente.',
                'exito'
            );
        } catch (error) {
            document.getElementById('error_formulario').textContent =
                error.message || 'No se pudo guardar la certificación en la API.';
        }
    }
// Acciones
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarCertificacion);
document.getElementById('buscadorCertificaciones').addEventListener('input', listar);
document.getElementById('tablaCertificacionesBody').addEventListener('click', function (evento) {
        const boton = evento.target.closest('.btn_tabla');

        if (boton) {
            editar(parseInt(boton.getAttribute('data-indice'), 10));
        }
    });

cargarCertificaciones();