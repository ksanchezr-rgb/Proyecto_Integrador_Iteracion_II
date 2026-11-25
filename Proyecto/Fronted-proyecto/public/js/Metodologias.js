/* ===== CATÁLOGO DE METODOLOGÍAS ===== */
let metodologias = [];

let editando = null;

function esc(texto) {
    return String(texto ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function normalizar(texto) {
    return String(texto ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    const caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

function listar() {
    const filtro = normalizar(document.getElementById('buscadorMetodologias').value.trim());

    let html = '';
    let mostradas = 0;

    for (let i = 0; i < metodologias.length; i++) {
        const metodologia = metodologias[i];

        const texto = normalizar(
            metodologia.codigo + ' ' +
            metodologia.nombre + ' ' +
            metodologia.descripcion
        );

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;

        html += '<tr>' +
            '<td class="codigo">' + esc(metodologia.codigo) + '</td>' +
            '<td>' + esc(metodologia.nombre) + '</td>' +
            '<td>' + esc(metodologia.descripcion) + '</td>' +
            '<td class="acciones">' +
                '<button type="button" class="btn_tabla" data-indice="' + i + '">EDITAR</button>' +
            '</td>' +
        '</tr>';
    }

    if (mostradas === 0) {
        const mensaje = metodologias.length === 0
            ? 'No hay metodologías para mostrar.'
            : 'No se encontraron metodologías con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="4">' + mensaje + '</td></tr>';
    }

    document.getElementById('tablaMetodologiasBody').innerHTML = html;

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostradas + ' de ' + metodologias.length + ' metodologías';
}

async function cargarMetodologias() {
     try {
         const respuesta = await pedirApi('GET', '/metodologias');
        metodologias = Array.isArray(respuesta)
               ? respuesta
              : (respuesta.metodologias || respuesta.data || []);
        listar();
    } catch (error) {
           metodologias = [];
         listar();
        aviso(error.message || 'No se pudieron cargar las metodologías desde la API.', 'error');
    }
 }
function abrirFormulario() {
    editando = null;

    document.getElementById('titulo_formulario').textContent = 'Registrar nueva metodología';
    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';

    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function editar(i) {
    if (i < 0 || i >= metodologias.length) {
        return;
    }

    abrirFormulario();

    editando = i;

    document.getElementById('titulo_formulario').textContent = 'Modificar metodología';
    document.getElementById('codigo').value = metodologias[i].codigo;
    document.getElementById('nombre').value = metodologias[i].nombre;
    document.getElementById('descripcion').value = metodologias[i].descripcion;

    document.getElementById('codigo').readOnly = true;
    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    editando = null;

    document.getElementById('panel_formulario').classList.add('oculto');
    document.getElementById('error_formulario').textContent = '';
}
async function guardarMetodologia(evento) {
    evento.preventDefault();
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('error_formulario').textContent = '';

    const datos = ValidacionesCatalogos.validar('metodologias', metodologias, editando);
    if (!datos) return;

    const esNuevo = editando === null;

    const metodologia = {
         codigo: datos.codigo,
          nombre: datos.nombre,
         descripcion: datos.descripcion
        }
    }
   try {
        if (esNuevo) {
            await pedirApi('POST', '/metodologias', metodologia);
        } else {
            const actual = metodologias[editando];
            const idRegistro = actual._id || actual.id || actual.codigo;
            await pedirApi('PUT', '/metodologias/' + encodeURIComponent(idRegistro), metodologia);
        }

        await cargarMetodologias();
        cerrarFormulario();

        aviso(
            esNuevo
                ? 'Metodología registrada correctamente.'
                : 'Metodología modificada correctamente.',
            'exito'
        );
    } catch (error) {
        document.getElementById('error_formulario').textContent =
            error.message || 'No se pudo guardar la metodología en la API.';
    }
}

// Acciones
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarMetodologia);
document.getElementById('buscadorMetodologias').addEventListener('input', listar);

document.getElementById('tablaMetodologiasBody').addEventListener('click', function(evento) {
    const boton = evento.target.closest('.btn_tabla');

    if (boton) {
        editar(parseInt(boton.getAttribute('data-indice'), 10));
    }
});

cargarMetodologias();