
/* ===== CATÁLOGO DE CARRERAS ===== */

var carreras = [];
var escuelas = [];
var editando = null;

// Escapar texto para mostrarlo en la tabla
function esc(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Normalizar texto para buscar sin distinguir mayúsculas ni tildes
function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Obtener el nombre de una escuela a partir de su código
function obtenerNombreEscuela(codigo) {
    var escuela = escuelas.find(function(item) {
        return item.codigo === codigo;
    });

    return escuela ? escuela.nombre : 'Escuela no encontrada';
}

// Mostrar avisos
function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

// Cargar las escuelas en el select
async function cargarEscuelas() {
    try {
        escuelas = await pedirApi('GET', '/escuelas');

        var select = document.getElementById('escuela');
        var codigoSeleccionado = select.value;

        select.innerHTML =
            '<option value="">Seleccione una escuela</option>';

        escuelas.forEach(function(escuela) {
            var opcion = document.createElement('option');
            opcion.value = escuela.codigo;
            opcion.textContent = escuela.nombre;
            select.appendChild(opcion);
        });

        select.value = codigoSeleccionado;

    } catch (error) {
        aviso(error.message, 'error');
    }
}

async function cargarCarreras() {
    try {
        carreras = await pedirApi('GET', '/carreras');
        listar();
    } catch (error) {
        aviso(error.message, 'error');
    }
}

// Listar y buscar carreras
function listar() {

    var filtro = normalizar(
        document.getElementById('buscador').value.trim()
    );
    

    var html = '';
    var mostradas = 0;

    for (var i = 0; i < carreras.length; i++) {
        var carrera = carreras[i];
        var nombreEscuela = obtenerNombreEscuela(carrera.escuela);

        var texto = normalizar(
            carrera.codigo + ' ' +
            carrera.nombre + ' ' +
            nombreEscuela
        );

        if (filtro !== '' && !texto.includes(filtro)) {
            continue;
        }

        mostradas++;

        html += '<tr>' +
            '<td class="codigo">' + esc(carrera.codigo) + '</td>' +
            '<td>' + esc(carrera.nombre) + '</td>' +
            '<td>' + esc(nombreEscuela) + '</td>' +
            '<td class="acciones">' +
                '<button type="button" class="btn_tabla" data-indice="' +
                i + '">' +
                    'EDITAR' +
                '</button>' +
                '<button type="button" class="btn_eliminar" data-indice="' +
                i + '">' +
                    'ELIMINAR' +
                '</button>' +
            '</td>' +
        '</tr>';
    }

    if (mostradas === 0) {
        var mensaje = carreras.length === 0
            ? 'No hay carreras para mostrar.'
            : 'No se encontraron carreras con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="4">' +
            mensaje +
        '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostradas + ' de ' +
        carreras.length + ' carreras';
}

// Abrir formulario para registrar
async function abrirFormulario() {
    editando = null;

    document.getElementById('titulo_formulario').textContent =
        'Registrar carrera';

    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';

    await cargarEscuelas();

    document.getElementById('panel_formulario')
        .classList.remove('oculto');

    document.getElementById('codigo').focus();
}

// Editar una carrera
async function editar(i) {
    if (i < 0 || i >= carreras.length) {
        return;
    }

   await abrirFormulario();

    editando = i;

    document.getElementById('titulo_formulario').textContent =
        'Modificar carrera';

    document.getElementById('codigo').value = carreras[i].codigo;
    document.getElementById('nombre').value = carreras[i].nombre;

    // Seleccionar la escuela asociada que ya tenía la carrera
    document.getElementById('escuela').value = carreras[i].escuela;

    // No permitir cambiar el código al editar
    document.getElementById('codigo').readOnly = true;

    document.getElementById('nombre').focus();
}

// Cerrar formulario
function cerrarFormulario() {
    editando = null;

    document.getElementById('panel_formulario')
        .classList.add('oculto');

    document.getElementById('error_formulario').textContent = '';
}

// Registrar o modificar una carrera
async function guardarCarrera(evento) {
    evento.preventDefault();

    const datos = ValidacionesCatalogos.validar(
        'carreras', carreras, editando
    );

    if (!datos) return;

    const carrera = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        escuela: datos.escuela
    };

    try {
        let resultado;

        if (editando === null) {
            resultado = await pedirApi(
                'POST', '/carreras', carrera
            );
        } else {
            const id = carreras[editando]._id;

            resultado = await pedirApi(
                'PUT', `/carreras/${id}`, carrera
            );
        }

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarCarreras();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

async function eliminarCarrera(carrera) {

    if (!confirm(`¿Eliminar "${carrera.nombre}"?`)) {
        return;
    }

    try {
        const resultado = await pedirApi(
            'DELETE', `/carreras/${carrera._id}`
        );

        aviso(resultado.mensaje, 'exito');
        cerrarFormulario();
        await cargarCarreras();

    } catch (error) {
        aviso(error.message, 'error');
    }
}

// Eventos
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);

document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);

document.getElementById('formulario').addEventListener('submit', guardarCarrera);

document.getElementById('buscador').addEventListener('input', listar);

document.getElementById('cuerpo_tabla').addEventListener('click', function(evento) {

        var botonEditar = evento.target.closest('.btn_tabla');
        var botonEliminar = evento.target.closest('.btn_eliminar');

        if (botonEditar) {
            const indice = Number(botonEditar.dataset.indice);
            editar(indice);
        }

        if (botonEliminar) {
            const indice = Number(botonEliminar.dataset.indice);
            eliminarCarrera(carreras[indice]);
        }
    });
// Inicializar catálogo
async function inicializar() {
    await cargarEscuelas();
    await cargarCarreras();
}

inicializar();