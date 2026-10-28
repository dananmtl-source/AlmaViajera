# Memoria del proyecto AlmaViajera

## 1. Presentación

AlmaViajera es un prototipo web para explorar destinos y guardar lugares de
interés antes de un viaje. El proyecto se centra en la consulta de países y
ciudades, la presentación de información útil para planificar una visita y la
gestión de una lista personal de favoritos.

La aplicación está desarrollada con HTML, CSS y JavaScript nativo. No es una
plataforma de compra de vuelos ni de reservas: su objetivo es ofrecer una base
visual y funcional para descubrir y organizar destinos.

## 2. Objetivos

- Crear una interfaz clara y adaptable a distintos tamaños de pantalla.
- Permitir acceder a la aplicación mediante un formulario de demostración.
- Facilitar la búsqueda de países y la consulta de sus ciudades destacadas.
- Permitir guardar y quitar ciudades favoritas.
- Separar la estructura, los estilos y la lógica de la interfaz en archivos
  organizados por responsabilidad.

## 3. Alcance y funcionamiento

El recorrido principal comienza en la página de acceso. Para esta demostración,
las credenciales se comparan con los datos del archivo
`src/assets/json/users.json`. La opción «Recordarme» determina si la sesión se
guarda en `localStorage` o en `sessionStorage`.

En la página de inicio, el usuario selecciona un país y consulta los resultados.
Los países, ciudades, descripciones, temporadas recomendadas y lugares
destacados utilizados por esta búsqueda proceden de
`src/assets/json/respuesta.json`. La interfaz crea las tarjetas de resultados
dinámicamente. Cada tarjeta permite alternar el estado de favorito, que se
persiste en el `localStorage` del navegador. La página de favoritos muestra las
ciudades guardadas.

La sección de cuenta permite editar nombre, apellidos y correo; guardar
preferencias de idioma y tema; cambiar la foto de perfil; y cambiar la
contraseña de demostración. Estos cambios se almacenan localmente por usuario.
También hay archivos de traducción para español e inglés, pero el cambio de
idioma no está implementado de forma integral.

## 4. Tecnologías y organización

El proyecto utiliza:

- **HTML** para las páginas y los formularios.
- **CSS** para los estilos compartidos, la adaptación a móvil y la presentación
  de las distintas páginas.
- **JavaScript** para la búsqueda, la creación de tarjetas, la autenticación de
  demostración y la gestión de favoritos.
- **JSON** para los datos locales de destinos y usuarios de demostración.
- **Web Storage** (`localStorage` y `sessionStorage`) para persistir favoritos
  y sesión en el navegador.

El código se organiza en páginas y estilos bajo `src/api`, recursos bajo
`src/assets`, lógica de interfaz bajo `src/ui` y utilidades bajo `src/utils`.
La descripción de carpetas y el procedimiento para ejecutar el proyecto se
encuentran en el [README](./README.md); el flujo de navegación y datos está en
el [diagrama](./diagrama.md).

## 5. Dificultades y decisiones

Durante el desarrollo se exploró el uso de una API externa de países. La
integración presentó dificultades relacionadas con las solicitudes desde el
navegador, CORS, la respuesta de la API y la diferencia entre los datos
disponibles y la información necesaria para las tarjetas. La utilidad para
consultar el servicio externo se conserva en `src/utils/functions.js`, pero la
búsqueda que utiliza la aplicación actualmente trabaja con los datos locales.

Esta decisión permite mantener un conjunto previsible de países y ciudades,
incluyendo contenido específico para la interfaz. También evita que el flujo de
búsqueda dependa de la disponibilidad o del formato de la API externa.

## 6. Limitaciones

- El acceso es demostrativo: los usuarios y contraseñas se encuentran en un
  archivo JSON accesible desde el navegador. No equivale a una autenticación
  segura y no debe usarse para proteger información real.
- Los datos de destinos son locales y su variedad depende del contenido de
  `respuesta.json`.
- Los favoritos y la sesión se guardan en el navegador actual; no se comparten
  entre dispositivos.
- El perfil, las preferencias, la imagen y la contraseña cambiada también se
  guardan localmente y no se sincronizan entre dispositivos.
- La utilidad de API externa no forma parte del flujo actual de búsqueda. Un
  despliegue no debe exponer claves privadas en JavaScript enviado al
  navegador; la integración debería realizarse desde un backend seguro.
- El selector de idioma todavía no traduce integralmente la interfaz.

## 7. Mejoras futuras

Como continuación del proyecto, se propone:

1. Implementar un backend para autenticar usuarios y proteger credenciales.
2. Integrar la API externa mediante un servidor que gestione las claves y
   normalice las respuestas.
3. Ampliar el catálogo y facilitar la actualización de los datos de destinos.
4. Completar la internacionalización de textos y controles.
5. Añadir pruebas automatizadas para los flujos principales y sincronización
   de cuenta si se incorpora un backend.

## 8. Conclusión

AlmaViajera establece una base funcional para descubrir destinos y mantener una
lista de favoritos. El uso de datos locales permitió completar la experiencia
principal pese a las dificultades de integración con la API. El resultado es
un prototipo demostrativo que puede evolucionar hacia una aplicación de viajes
más completa al incorporar servicios seguros, más contenido y pruebas.
