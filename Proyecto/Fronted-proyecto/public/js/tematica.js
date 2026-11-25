/* ===== Tematica ===== */
var tematicas = [];
var editando = null;

function esc(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function normalizar(texto) {
    return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

async function cargarTematicas() {
    try {
        tematicas = await pedirApi('GET', '/tematicas');
        listar();
    } catch (error) {
        aviso(error.message, 'error');
    }
}

function listar() {
    var filtro = normalizar(document.getElementById('buscador').value.trim());
    var html = '';
    var mostradas = 0;

    for (var i = 0; i < tematicas.length; i++) {
        var a = tematicas[i];
        var texto = normalizar(a.codigo + ' ' + a.nombre + ' ' + a.descripcion);

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;
        html += '<tr>' +
            '<td class="codigo">' + esc(a.codigo) + '</td>' +
            '<td>' + esc(a.nombre) + '</td>' +
            '<td>' + esc(a.descripcion) + '</td>' +
            '<td class="acciones">' +
            '<button type="button" class="btn_tabla" data-indice="' + i + '">' + 'EDITAR' + '</button>' +
            '<button type="button" class="btn_eliminar" data-indice="' + i + '">' + 'ELIMINAR' + '</button>' +
            '</td>' +
            '</tr>';
    }

    if (mostradas === 0) {
        var msg = tematicas.length === 0 ? 'No hay temáticas para mostrar.' : 'No se encontraron temáticas con esa búsqueda.';
        html = '<tr><td class="vacio" colspan="4">' + msg + '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;
    document.getElementById('conteo').textContent = 'Mostrando ' + mostradas + ' de ' + tematicas.length + ' temáticas';
}

function abrirFormulario() {
    editando = null;
    document.getElementById('titulo_formulario').textContent = 'Registrar temática';
    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function editar(i) {
    abrirFormulario();
    editando = i;
    document.getElementById('titulo_formulario').textContent = 'Modificar Tematica';
    document.getElementById('codigo').value = tematicas[i].codigo;
    document.getElementById('nombre').value = tematicas[i].nombre;
    document.getElementById('descripcion').value = tematicas[i].descripcion;
    document.getElementById('codigo').readOnly = true;
    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    editando = null;
    document.getElementById('panel_formulario').classList.add('oculto');
}

async function guardarTematica(evento) {
    evento.preventDefault();

    const datos = ValidacionesCatalogos.validar(
        'tematica', tematicas, editando
    );

    if (!datos) return;

    const tematica = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion
    };

    try {
        let resultado;

        if (editando === null) {
            resultado = await pedirApi(
                'POST', '/tematicas', tematica
            );
        } else {
            const id = tematicas[editando]._id;

            resultado = await pedirApi(
                'PUT', `/tematicas/${id}`, tematica
            );
        }

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarTematicas();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

async function eliminarTematica(tematica) {

    if (!confirm(`¿Eliminar "${tematica.nombre}"?`)) {
        return;
    }

    try {
        const resultado = await pedirApi(
            'DELETE', `/tematicas/${tematica._id}`
        );

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarTematicas();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

// Eventos (sin onclick/onsubmit dentro del HTML)
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarTematica);
document.getElementById('buscador').addEventListener('input', listar);
document.getElementById('cuerpo_tabla')
    .addEventListener('click', function(evento) {

        var botonEditar = evento.target.closest('.btn_tabla');
        var botonEliminar = evento.target.closest('.btn_eliminar');

        if (botonEditar) {
            const indice = Number(botonEditar.dataset.indice);
            editar(indice);
        }

        if (botonEliminar) {
            const indice = Number(botonEliminar.dataset.indice);
            eliminarTematica(tematicas[indice]);
        }
    });

cargarTematicas();