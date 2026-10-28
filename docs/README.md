# AlmaViajera

AlmaViajera es un prototipo web de viajes. Permite explorar destinos, consultar
información de ciudades y guardar o quitar favoritos en el navegador. La
interfaz está en español y utiliza HTML, CSS y JavaScript nativo, sin un
framework ni un proceso de compilación.

## Requisitos

- Un navegador web moderno.
- Python 3 para iniciar el servidor local de la forma indicada abajo, o una
  extensión equivalente como Live Server.

No hay `package.json` ni dependencias de Node.js que instalar.

## Cómo ejecutar

Desde la carpeta raíz del repositorio, inicia un servidor HTTP estático:


Es necesario servir el proyecto por HTTP y no abrir los HTML directamente con
`file://`: las páginas cargan módulos JavaScript y archivos JSON mediante
solicitudes `fetch`.

## Recorrido por la aplicación

1. **Acceso** — [index.html](../index.html) muestra el formulario de inicio de
   sesión. Las credenciales de demostración se leen de
   [users.json](../src/assets/json/users.json).
2. **Inicio y búsqueda** — [inicio.html](../src/api/html/inicio.html) permite
   elegir un país y buscarlo. Las ciudades y sus detalles se cargan del
   conjunto de datos local [respuesta.json](../src/assets/json/respuesta.json).
3. **Favoritos** — los botones de las tarjetas guardan o eliminan ciudades en
   `localStorage`; [favoritos.html](../src/api/html/favoritos.html) muestra los
   elementos guardados.
4. **Cuenta** — [cuenta.html](../src/api/html/cuenta.html) es una página
   preparada para la sección de cuenta.

La sesión se almacena en `sessionStorage` o `localStorage`, según se marque
«Recordarme». Los favoritos se guardan en `localStorage` del navegador actual.
Por tanto, esos datos no se sincronizan entre dispositivos ni perfiles del
navegador.

## Estructura del proyecto

```text
.
├── index.html                  # Acceso
├── docs/                       # Documentación del proyecto
└── src/
    ├── api/
    │   ├── css/                # Estilos compartidos y estilos de páginas
    │   └── html/               # Inicio, cuenta, favoritos y página de prueba
    ├── assets/
    │   ├── i18n/               # Archivos de textos en español e inglés
    │   ├── images/             # Logo e imágenes
    │   └── json/               # Datos locales y usuarios de demostración
    ├── ui/                     # Lógica de formularios y visualización
    ├── utils/                  # Autenticación, errores y utilidades de API
    ├── index.js                # Búsqueda y creación de tarjetas de destinos
    └── localStorage.js         # Gestión de favoritos en el navegador
```

## Datos y módulos principales

- `src/index.js` carga los destinos del JSON local, llena el selector, filtra
  resultados y crea las tarjetas con sus botones de favorito.
- `src/localStorage.js` expone las funciones para leer, guardar, consultar y
  alternar favoritos.
- `src/ui/favoritos.js` genera la lista de favoritos.
- `src/ui/login.js` comprueba el formulario de acceso contra el JSON de usuarios
  de demostración.
- `src/utils/auth.js` comprueba la sesión y gestiona el cierre de sesión.
- `src/utils/functions.js` contiene utilidades para consultar un servicio
  externo de países. El flujo de búsqueda descrito arriba utiliza actualmente
  el conjunto de datos local.

## Limitaciones del prototipo

- El inicio de sesión es solo demostrativo: los usuarios y sus contraseñas se
  descargan al navegador desde un archivo JSON. No debe utilizarse como sistema
  de autenticación real.
- Los datos de países y ciudades de la búsqueda dependen del contenido local
  de `src/assets/json/respuesta.json`.
- Los archivos de traducción existen, pero la interfaz todavía no cambia de
  idioma de forma integral.
- La utilidad de API externa requiere una configuración segura de credenciales
  antes de utilizarse en un despliegue. No se deben incluir claves privadas en
  código JavaScript servido al navegador.
- No hay pruebas automatizadas ni scripts de compilación configurados en el
  repositorio.
