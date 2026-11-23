<div align="center">

# 🎓 Sistema de Desarrollo Curricular y Docente

### Universidad CENFOTEC

**Aplicación web académica para la gestión de cursos, usuarios y catálogos del área de desarrollo curricular.**

![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-orange?style=flat-square)
![Proyecto](https://img.shields.io/badge/Tipo-Proyecto%20acad%C3%A9mico-blue?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-yellow?style=flat-square)
![Servidor](https://img.shields.io/badge/Servidor-Node.js%20%2B%20Express-green?style=flat-square)

</div>

---

## 📖 Descripción del proyecto

El **Sistema de Desarrollo Curricular y Docente** es un proyecto académico que busca facilitar la organización y administración de la información relacionada con los cursos de la Universidad CENFOTEC.

La aplicación cuenta con páginas para el registro e inicio de sesión de usuarios, administración de cursos y mantenimiento de diferentes catálogos utilizados en el proceso curricular. La versión actual funciona principalmente desde el navegador, utilizando **localStorage** para almacenar datos y **sessionStorage** para manejar la sesión básica del usuario.

El proyecto incorpora un servidor local desarrollado con **Node.js y Express**, encargado de entregar al navegador los archivos HTML, CSS, JavaScript e imágenes del frontend.

> **Estado actual:** el repositorio incluye una versión de frontend en desarrollo. El servidor Express entrega archivos estáticos, pero aún no implementa una API para la gestión de datos ni una conexión funcional con MongoDB.

---

## 🎯 Objetivos

- Organizar la información de cursos y catálogos curriculares en una sola aplicación.
- Facilitar el registro, la consulta y la edición de la información de los cursos.
- Proporcionar interfaces para la gestión de usuarios y sus perfiles.
- Aplicar validaciones a los formularios para mejorar la calidad de los datos ingresados.
- Mantener una estructura de proyecto ordenada y preparada para futuras integraciones con un backend y una base de datos.

---

## ✨ Funcionalidades presentes en el código

### 👤 Usuarios y acceso

- Formularios de registro e inicio de sesión.
- Gestión de usuarios y consulta o modificación de datos del perfil.
- Validaciones de campos en formularios.
- Sesión básica en el navegador mediante `sessionStorage`.
- Almacenamiento local de usuarios para la versión de prueba.

### 📚 Cursos

- Formulario de registro de cursos.
- Listado y consulta de cursos registrados.
- Visualización de información detallada y opción de edición.
- Búsqueda y filtros por estados de los cursos.
- Relación de los cursos con datos provenientes de catálogos.

### 🗂️ Catálogos

El proyecto contiene páginas y scripts para administrar o consultar información de:

- Escuelas y carreras.
- Áreas SFIA (identificadas como `sfia` en algunos nombres de archivo).
- Temáticas y metodologías de aprendizaje.
- Niveles de complejidad.
- Estados de curso y modalidades.
- Monedas y certificaciones.

> La presencia de una página o script indica que existe una implementación en el proyecto; no implica que todos los casos de uso estén completamente probados o terminados.

---

## 🧰 Tecnologías utilizadas

| Tecnología | Función en el proyecto |
|---|---|
| **HTML5** | Estructura de las páginas y formularios. |
| **CSS3** | Diseño y presentación visual. |
| **JavaScript** | Interactividad, validaciones, navegación y manejo de datos en el navegador. |
| **Node.js** | Ejecución del servidor local. |
| **Express** | Publicación de los archivos del frontend mediante HTTP. |
| **npm** | Instalación de dependencias y ejecución de comandos. |
| **localStorage** | Almacenamiento local de datos durante el desarrollo. |
| **sessionStorage** | Almacenamiento temporal de la sesión del usuario. |
| **MongoDB** | Base de datos contemplada para una siguiente etapa; actualmente se incluye un script para crear colecciones, sin conexión activa a la aplicación. |

---

## 🏗️ Estructura del proyecto

```text
Proyecto/
├── public/
│   ├── index.html             # Punto de entrada del frontend
│   ├── css/                   # Hojas de estilos
│   ├── img/                   # Imágenes
│   ├── js/                    # Lógica y validaciones del navegador
│   └── pages/                 # Páginas HTML del sistema
├── server/
│   └── playground-1.mongodb.js # Script para crear colecciones en MongoDB
├── server.js                  # Servidor Express
├── package.json               # Configuración y comandos npm
├── package-lock.json          # Registro de dependencias
└── .gitignore                 # Archivos excluidos de Git
```

### ¿Cómo funciona esta estructura?

1. El usuario accede a `http://localhost:3000` desde el navegador.
2. **Express**, configurado en `server.js`, entrega los archivos que están dentro de `public/`.
3. `index.html` redirige a la página de inicio del sistema.
4. Los archivos JavaScript del navegador gestionan las interacciones, validaciones y datos almacenados localmente.

**Importante:** en esta versión, `server.js` funciona como servidor de archivos estáticos. Todavía no procesa las operaciones de cursos y usuarios mediante una API conectada a una base de datos.

---

## 🚀 Instalación y ejecución

### Requisitos previos

- Tener **Node.js y npm** instalados.
- Contar con un navegador web.
- Utilizar un editor como **Visual Studio Code** (recomendado, pero no obligatorio).

### 1. Obtener el proyecto

Clonar el repositorio desde GitHub o descargarlo como archivo ZIP y descomprimirlo.

### 2. Abrir la carpeta correcta

En Visual Studio Code, abrir la carpeta **`Proyecto`**, donde se encuentran `server.js` y `package.json`.

### 3. Instalar las dependencias

Abrir una terminal en esa carpeta y ejecutar:

```bash
npm install
```

Este paso instala Express y las demás dependencias indicadas en `package.json`. Normalmente basta con hacerlo la primera vez o cuando cambien las dependencias.

### 4. Iniciar el servidor

```bash
npm start
```

El comando ejecuta `node server.js`. De forma predeterminada, el servidor utiliza el **puerto 3000**.

### 5. Abrir la aplicación

En el navegador, ingresar a:

**http://localhost:3000**

La dirección `localhost` corresponde a la propia computadora. Para acceder de esta forma, el servidor debe mantenerse encendido.

### 6. Detener el servidor

En la terminal donde se está ejecutando, presionar **Ctrl + C**.

### Modo de desarrollo (opcional)

```bash
npm run dev
```

Este comando utiliza `node --watch server.js` para reiniciar el proceso si cambia el archivo del servidor. Para ver cambios en HTML y CSS normalmente basta con actualizar el navegador.

---

## 💾 Almacenamiento y base de datos

**Almacenamiento actual:** gran parte de la información se maneja desde el navegador con `localStorage`, mientras que la sesión básica utiliza `sessionStorage`.

**Preparación para MongoDB:** el archivo `server/playground-1.mongodb.js` contiene instrucciones para crear colecciones como `usuarios`, `cursos`, `escuelas`, `carreras`, `tematicas` y otras relacionadas con el sistema.

Ese archivo **no conecta automáticamente** la aplicación a MongoDB. Para lograr persistencia centralizada será necesario implementar y configurar la comunicación entre el servidor y la base de datos.

> ⚠️ **Nota de seguridad:** el almacenamiento de contraseñas en `localStorage` y la autenticación del lado del navegador son soluciones de demostración académica, no adecuadas para producción. Antes de desplegar el sistema para usuarios reales es necesario implementar autenticación y autorización seguras desde el servidor.

---

## 🚦 Estado actual y trabajo pendiente

| Componente | Estado |
|---|---|
| Estructura de carpetas del frontend | Incluida |
| Páginas HTML y estilos CSS | Incluidos |
| Scripts de formularios, cursos y catálogos | Incluidos |
| Validaciones en JavaScript | Incluidas |
| Almacenamiento local en el navegador | Implementado en diversos módulos |
| Servidor Express en el puerto 3000 | Configurado |
| Script de creación de colecciones MongoDB | Incluido |
| API de backend para datos | Pendiente |
| Conexión de la aplicación a MongoDB | Pendiente |
| Autenticación segura desde el servidor | Pendiente |
| Pruebas integrales de todas las funciones | Por verificar |

---

## 🔮 Mejoras previstas

- Integrar MongoDB para guardar la información fuera del navegador.
- Crear rutas y servicios en el backend para consultar y modificar datos.
- Implementar un sistema seguro de autenticación y permisos.
- Continuar mejorando la interfaz, los formularios y las validaciones.
- Completar y probar los procesos de administración de cursos y catálogos.

---

## 📄 Uso académico

Este repositorio forma parte de un **proyecto académico de la Universidad CENFOTEC**. La aplicación está en desarrollo y sus funciones deben entenderse dentro de ese contexto.

<div align="center">

**Universidad CENFOTEC · Proyecto académico · 2026**

</div>
