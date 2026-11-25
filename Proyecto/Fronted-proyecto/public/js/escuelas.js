
/* ===== CATÁLOGO DE ESCUELAS ===== */
// segunda iteracion vamos a empezar a utilizar las funciones de la api en vez de las de localStorage, para ello creamos un archivo
//api.js que contiene las funciones para hacer peticiones a la api, y lo importamos en este archivo Luego modificamos
//este archivo para que use las funciones de la api

var escuelas = [];
var editando = null; // null = registrando; número = editando

function esc(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function normalizar(texto) {
    return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}
async function cargarEscuelas() {
    try {
        escuelas = await pedirApi('GET', '/escuelas');
        listar();
    } catch (error) {
        aviso(error.message, 'error');
    }
}

function listar() {
    var filtro = normalizar(
        document.getElementById('buscador').value.trim()
    );

    var html = '';
    var mostradas = 0;

    for (var i = 0; i < escuelas.length; i++) {
        var escuela = escuelas[i];

        var texto = normalizar(
            escuela.codigo + ' ' +
            escuela.nombre + ' ' +
            escuela.director
        );

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;

        html += '<tr>' +
            '<td class="codigo">' + esc(escuela.codigo) + '</td>' +
            '<td>' + esc(escuela.nombre) + '</td>' +
            '<td>' + esc(escuela.director) + '</td>' +
            '<td class="acciones">' +
            '<button type="button" class="btn_tabla" data-indice="' + i + '">' +
                'EDITAR' +
            '</button>' +
            '<button type="button" class="btn_eliminar" data-indice="' + i + '">' +
                'ELIMINAR' +
            '</button>' +
        '</td>' +
        '</tr>';
    }

    if (mostradas === 0) {
        var mensaje = escuelas.length === 0
            ? 'No hay escuelas para mostrar.'
            : 'No se encontraron escuelas con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="4">' +
            mensaje +
        '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostradas + ' de ' + escuelas.length + ' escuelas';
}

function abrirFormulario() {
    editando = null;

    document.getElementById('titulo_formulario').textContent =
        'Registrar escuela';

    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';

    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function editar(i) {
    if (i < 0 || i >= escuelas.length) {
        return;
    }

    abrirFormulario();

    editando = i;

    document.getElementById('titulo_formulario').textContent =
        'Modificar escuela';

    document.getElementById('codigo').value = escuelas[i].codigo;
    document.getElementById('nombre').value = escuelas[i].nombre;
    var selectDirector = document.getElementById('director');

    for (var j = 0; j < selectDirector.options.length; j++) {
        if (selectDirector.options[j].text === escuelas[i].director) {
            selectDirector.selectedIndex = j;
            break;
        }
    }

    // El código no se puede cambiar al editar
    document.getElementById('codigo').readOnly = true;

    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    editando = null;

    document.getElementById('panel_formulario').classList.add('oculto');
    document.getElementById('error_formulario').textContent = '';
}

async function guardarEscuela(evento) {
    evento.preventDefault();

    const datos = ValidacionesCatalogos.validar(
        'escuelas', escuelas, editando
    );

    if (!datos) return;

    const escuela = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        director: document.getElementById('director')
            .selectedOptions[0].text.trim()
    };

    try {
        let resultado;

        if (editando === null) {
            resultado = await pedirApi(
                'POST', '/escuelas', escuela
            );
        } else {
            const id = escuelas[editando]._id;

            resultado = await pedirApi(
                'PUT', `/escuelas/${id}`, escuela
            );
        }

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarEscuelas();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

async function eliminarEscuela(escuela) {

    if (!confirm(`¿Eliminar "${escuela.nombre}"?`)) {
        return;
    }

    try {
        const resultado = await pedirApi(
            'DELETE', `/escuelas/${escuela._id}`
        );

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarEscuelas();

    } catch (error) {
        aviso(error.message, 'error');
    }
}
//accion
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarEscuela);
document.getElementById('buscador').addEventListener('input', listar);
document.getElementById('cuerpo_tabla')
    .addEventListener('click', function (evento) {

        var botonEditar = evento.target.closest('.btn_tabla');

        var botonEliminar = evento.target.closest('.btn_eliminar');

        if (botonEditar) {
            const indice = Number(botonEditar.dataset.indice);
            editar(indice);
        }

        if (botonEliminar) {
            const indice = Number(botonEliminar.dataset.indice);
            eliminarEscuela(escuelas[indice]);
        }
    });

cargarEscuelas();