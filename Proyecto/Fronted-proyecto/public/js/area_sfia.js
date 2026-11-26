/* ===== ÁREA SFIA ===== */
var areas = [];
var editando = null;

function esc(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Minúsculas y sin tildes, para que "area" encuentre "ÁREA"
function normalizar(texto) {
    return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

async function cargarAreas() {
    try {
        areas = await pedirApi('GET', '/area_sfia');
        listar();
    } catch (error) {
        aviso(error.message, 'error');
    }
}

function listar() {
    var filtro = normalizar(document.getElementById('buscador').value.trim());
    var html = '';
    var mostradas = 0;

    for (var i = 0; i < areas.length; i++) {
        var a = areas[i];
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
            '<button type="button" class="btn_eliminar" data-indice="' + i + '">' + 'ELIMINAR' +'</button>' +
        '</td>' +
            '</tr>';
    }

    if (mostradas === 0) {
        var msg = areas.length === 0 ? 'No hay áreas para mostrar.' : 'No se encontraron áreas con esa búsqueda.';
        html = '<tr><td class="vacio" colspan="4">' + msg + '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;
    document.getElementById('conteo').textContent = 'Mostrando ' + mostradas + ' de ' + areas.length + ' áreas';
}

function abrirFormulario() {
    editando = null;
    document.getElementById('titulo_formulario').textContent = 'Registrar área SFIA';
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
    document.getElementById('titulo_formulario').textContent = 'Modificar área SFIA';
    document.getElementById('codigo').value = areas[i].codigo;
    document.getElementById('nombre').value = areas[i].nombre;
    document.getElementById('descripcion').value = areas[i].descripcion;
    document.getElementById('codigo').readOnly = true;
    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    editando = null;
    document.getElementById('panel_formulario').classList.add('oculto');
}

async function guardarArea(evento) {
    evento.preventDefault();

    const datos = ValidacionesCatalogos.validar(
        'area_sfia', areas, editando
    );

    if (!datos) return;

    const area = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion
    };

    try {
        let resultado;

        if (editando === null) {
            resultado = await pedirApi('POST', '/area_sfia', area);
        } else {
            const id = areas[editando]._id;

            resultado = await pedirApi(
                'PUT', `/area_sfia/${id}`, area
            );
        }

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarAreas();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

async function eliminarArea(area) {

    if (!confirm(`¿Eliminar "${area.nombre}"?`)) {
        return;
    }

    try {
        const resultado = await pedirApi(
            'DELETE', `/area_sfia/${area._id}`
        );

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarAreas();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

// Eventos (sin onclick/onsubmit dentro del HTML)
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarArea);
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
            eliminarArea(areas[indice]);
        }
    });
cargarAreas();
