var niveles = JSON.parse(localStorage.getItem('nivel')) || [];
var editando = null;

function guardar() {
    localStorage.setItem('nivel', JSON.stringify(niveles));
}

function esc(texto) {
    return String(texto === undefined ? '' : texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

function limpiarErrores() {
    document.getElementById('error_formulario').textContent = '';
}

function listar() {
    var filtro = normalizar(document.getElementById('buscador').value.trim());
    var html = '';
    var mostrados = 0;

    for (var i = 0; i < niveles.length; i++) {
        var nivel = niveles[i];
        var texto = normalizar(nivel.codigo + ' ' + nivel.nombre + ' ' + nivel.descripcion + ' ' + nivel.nivel);

        if (filtro !== '' && !texto.includes(filtro)) {
            continue;
        }

        mostrados++;

        html += '<tr>' +
            '<td class="codigo">' + esc(nivel.codigo) + '</td>' +
            '<td>' + esc(nivel.nombre) + '</td>' +
            '<td>' + esc(nivel.descripcion) + '</td>' +
            '<td>' + esc(nivel.nivel) + '</td>' +
            '<td>' +
                '<button type="button" class="btn_tabla" data-accion="editar" data-indice="' + i + '">EDITAR</button>' +
            '</td>' +
        '</tr>';
    }

    if (mostrados === 0) {
        var mensaje = niveles.length === 0
            ? 'No hay niveles para mostrar.'
            : 'No se encontraron niveles con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="5">' + mensaje + '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;
    document.getElementById('conteo').textContent =
        'Mostrando ' + mostrados + ' de ' + niveles.length + ' niveles';
}

function abrirFormulario() {
    editando = null;

    document.getElementById('formulario').reset();
    document.getElementById('titulo_formulario').textContent = 'Registrar nivel';
    document.querySelector('#formulario button[type="submit"]').textContent = 'REGISTRAR';

    limpiarErrores();
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function editarNivel(indice) {
    editando = indice;

    var nivel = niveles[indice];

    document.getElementById('codigo').value = nivel.codigo;
    document.getElementById('nombre').value = nivel.nombre;
    document.getElementById('descripcion').value = nivel.descripcion;
    document.getElementById('nivel_complejidad').value = nivel.nivel;

    document.getElementById('titulo_formulario').textContent = 'Editar nivel';
    document.querySelector('#formulario button[type="submit"]').textContent = 'ACTUALIZAR';

    limpiarErrores();
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function cerrarFormulario() {
    document.getElementById('panel_formulario').classList.add('oculto');
    document.getElementById('formulario').reset();
    limpiarErrores();
    editando = null;
}

function mayuscula(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

async function guardarNivel(evento) {
    evento.preventDefault();

    // validaciones

    var nuevoNivel = {
        codigo,
        nombre,
        descripcion,
        nivel
    };

    if (editando === null) {
        try {
            await pedirApi('POST', '/niveles', nuevoNivel);
        } catch (error) {
            aviso(error.message, 'error');
            return;
        }
    }

    if (editando === null) {
        niveles.push(nuevoNivel);
    } else {
        niveles[editando] = nuevoNivel;
    }

    guardar();
    listar();
    cerrarFormulario();
}

document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarNivel);
document.getElementById('buscador').addEventListener('input', listar);

document.getElementById('cuerpo_tabla').addEventListener('click', function (evento) {
    var boton = evento.target.closest('[data-accion="editar"]');

    if (boton) {
        editarNivel(Number(boton.dataset.indice));
    }
});

listar();