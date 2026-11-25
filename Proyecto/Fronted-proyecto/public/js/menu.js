/* Navegación centralizada. Cambiar opciones aquí actualiza todas las páginas. */
(function () {
    'use strict';
    const paginasCatalogo = ['inicio_para_catalogos.html','catalogo_escuela.html','catalogo_carreras.html','estado_curso.html','area_sfia.html','tematica.html','Metodologias.html','nivel.html','certificaciones.html','catalogo_moneda.html'];
    const nombrePagina = decodeURIComponent(location.pathname.split('/').pop() || 'inicio.html');
    const lista = document.querySelector('header .opciones');
    if (!lista) return;
    const modo = document.body.dataset.menu || 'interno';
    const principal = [
        { texto: 'USUARIOS', url: 'gestion_usuarios.html', paginas: ['gestion_usuarios.html','registrar_adentro.html','perfil_usuario.html'] },
        { texto: 'CATÁLOGOS', url: 'inicio_para_catalogos.html', paginas: paginasCatalogo },
        { texto: 'CURSOS', url: 'cursos.html', paginas: ['cursos.html','formulario_curso.html'] },
        { texto: 'REPORTES', url: 'reportes.html', paginas: ['reportes.html'] }
    ];
    const opciones = modo === 'publico' ? [
        { texto: 'INICIO', url: 'inicio.html', paginas: ['inicio.html'] },
        { texto: 'INICIAR SESIÓN', url: 'iniciar_session.html', clase: 'btn-login' }
    ] : [
        ...(modo === 'registro' ? [] : principal),
        { texto: 'ES / EN', boton: true, clase: 'btn_header btn_idioma' },
        { texto: 'SALIR', boton: true, clase: 'btn_header btn_salir' }
    ];
    lista.replaceChildren();
    opciones.forEach(function (opcion) {
        const li = document.createElement('li');
        li.className = 'elemento_menu';
        const elemento = document.createElement(opcion.boton ? 'button' : 'a');
        elemento.textContent = opcion.texto;
        if (opcion.boton) elemento.type = 'button';
        else elemento.href = opcion.url;
        elemento.className = opcion.clase || 'enlace_menu';
        if (opcion.paginas && opcion.paginas.includes(nombrePagina)) {
            elemento.classList.add('enlace_activo');
            elemento.setAttribute('aria-current', 'page');
        }
        if (opcion.texto === 'SALIR') {
            elemento.addEventListener('click', function () {
                sessionStorage.removeItem('sesion');
                window.location.replace('iniciar_session.html');
            });
        }
        // El botón ES/EN conserva su apariencia; no hay traducciones implementadas todavía.
        li.appendChild(elemento);
        lista.appendChild(li);
    });
})();
