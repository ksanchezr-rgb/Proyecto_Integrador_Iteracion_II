/* Reglas reutilizables para los formularios de catálogos. */
window.ValidacionesCatalogos = (function () {
    'use strict';
    const reglas = {
        escuelas:       { codigo: 'alfanumerico', nombre: true, director: true },
        carreras:       { codigo: 'alfanumerico', nombre: true, escuela: true },
        area_sfia:      { codigo: 'alfanumerico', nombre: true, descripcion: false },
        tematica:       { codigo: 'alfanumerico', nombre: true, descripcion: true },
        metodologias:   { codigo: 'alfanumerico', nombre: true, descripcion: true },
        nivel:          { codigo: 'numerico', nombre: true, descripcion: true, nivel_complejidad: true },
        certificaciones:{ codigo: 'numerico', nombre: true, descripcion: true }
    };
    const nombres = { codigo: 'el código', nombre: 'el nombre', descripcion: 'la descripción', director: 'el director', escuela: 'la escuela', nivel_complejidad: 'el nivel de complejidad' };
    function valor(id) {
        const campo = document.getElementById(id);
        return campo ? campo.value.trim() : '';
    }
    function validar(tipo, registros, indiceEdicion) {
        const regla = reglas[tipo];
        if (!regla) throw new Error('Catálogo sin reglas de validación: ' + tipo);
        const salida = {};
        const faltantes = [];
        Object.keys(regla).forEach(function (id) {
            salida[id] = valor(id);
            if (regla[id] && !salida[id]) faltantes.push(nombres[id]);
        });
        const caja = document.getElementById('error_formulario');
        if (caja) caja.textContent = '';
        function fallo(mensaje) { if (caja) caja.textContent = mensaje; return null; }
        if (faltantes.length) {
            const ultimo = faltantes.pop();
            const conjunto = faltantes.length ? faltantes.join(', ') + ' y ' + ultimo : ultimo;
            const mensaje = conjunto.charAt(0).toUpperCase() + conjunto.slice(1) +
                (faltantes.length ? ' son obligatorios.' : (ultimo === 'la descripción' || ultimo === 'la escuela' ? ' es obligatoria.' : ' es obligatorio.'));
            return fallo(mensaje);
        }
        const codigo = salida.codigo.toUpperCase();
        if (regla.codigo === 'numerico' && !/^\d+$/.test(codigo)) return fallo('El código debe ser numérico (solo dígitos).');
        if (regla.codigo === 'alfanumerico' && !/^[A-Z0-9-]+$/.test(codigo)) return fallo('El código solo admite letras, números y guiones.');
        salida.codigo = codigo;
        const repetido = (registros || []).some(function (item, i) {
            return i !== indiceEdicion && String(item.codigo).toUpperCase() === codigo;
        });
        if (repetido) return fallo('Ya existe un registro con este código.');
        return salida;
    }
    return { validar: validar, reglas: reglas };
})();
