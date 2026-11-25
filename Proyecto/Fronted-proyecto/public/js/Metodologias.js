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
                '<button type="button" class="btn_eliminar" data-indice="' + i + '">ELIMINAR</button>' +
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
        metodologias = await pedirApi('GET', '/metodologias');
        listar();
    } catch (error) {
        aviso(error.message, 'error');
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

    const datos = ValidacionesCatalogos.validar(
        'metodologias', metodologias, editando
    );

    if (!datos) return;

    const metodologia = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion
    };

    try {
        let resultado;

        if (editando === null) {
            resultado = await pedirApi(
                'POST', '/metodologias', metodologia
            );
        } else {
            const id = metodologias[editando]._id;

            resultado = await pedirApi(
                'PUT', `/metodologias/${id}`, metodologia
            );
        }

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarMetodologias();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

async function eliminarMetodologia(metodologia) {

    if (!confirm(`¿Eliminar "${metodologia.nombre}"?`)) {
        return;
    }

    try {
        const resultado = await pedirApi(
            'DELETE', `/metodologias/${metodologia._id}`
        );

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarMetodologias();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

// Acciones
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarMetodologia);
document.getElementById('buscadorMetodologias').addEventListener('input', listar);

document.getElementById('tablaMetodologiasBody')
    .addEventListener('click', function(evento) {

        const botonEditar = evento.target.closest('.btn_tabla');
        const botonEliminar = evento.target.closest('.btn_eliminar');

        if (botonEditar) {
            const indice = Number(botonEditar.dataset.indice);
            editar(indice);
        }

        if (botonEliminar) {
            const indice = Number(botonEliminar.dataset.indice);
            eliminarMetodologia(metodologias[indice]);
        }
    });
cargarMetodologias();