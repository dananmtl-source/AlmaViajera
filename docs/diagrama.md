# Diagrama del proyecto

## Flujo de navegación y datos

```mermaid
flowchart TD
    Browser["Navegador"]

    Login["index.html<br/>Inicio de sesión"]
    LoginJS["src/ui/login.js"]
    Users["src/assets/json/users.json<br/>Usuarios de demostración"]
    Session{"¿Recordarme?"}
    SessionStorage["sessionStorage"]
    LocalSession["localStorage<br/>sesión"]

    Inicio["src/api/html/inicio.html<br/>Búsqueda de destinos"]
    AppJS["src/index.js"]
    Destinos["src/assets/json/respuesta.json<br/>Países y ciudades"]
    FavoritesJS["src/localStorage.js"]
    FavoritesStore["localStorage<br/>favoritos"]

    Favoritos["src/api/html/favoritos.html"]
    FavoritesUI["src/ui/favoritos.js"]
    Cuenta["src/api/html/cuenta.html<br/>Sección preparada"]

    CSS["src/api/css/<br/>style.css y estilos de página"]
    Auth["src/utils/auth.js<br/>Control de sesión y cierre"]
    ApiUtils["src/utils/functions.js<br/>Utilidades de API externa<br/>(no usadas por la búsqueda actual)"]

    Browser --> Login
    Login --> LoginJS
    LoginJS --> Users
    LoginJS --> Session
    Session -->|Sí| LocalSession
    Session -->|No| SessionStorage
    LoginJS -->|Acceso correcto| Inicio

    Inicio --> AppJS
    AppJS --> Destinos
    AppJS --> FavoritesJS
    FavoritesJS <--> FavoritesStore
    Inicio -->|Abrir favoritos| Favoritos
    Favoritos --> FavoritesUI
    FavoritesUI --> FavoritesJS
    FavoritesUI --> FavoritesStore

    Inicio -->|Abrir cuenta| Cuenta
    Cuenta --> Auth
    Inicio --> Auth
    Favoritos --> Auth
    Auth --> SessionStorage
    Auth --> LocalSession
    Auth -->|Cerrar sesión| Login

    Login -. estilos .-> CSS
    Inicio -. estilos .-> CSS
    Favoritos -. estilos .-> CSS
    Cuenta -. estilos .-> CSS
```

## Estructura resumida

```text
AlmaViajera/
├── index.html                    # Acceso
├── docs/
│   ├── README.md                 # Descripción y ejecución
│   └── diagrama.md               # Este diagrama
└── src/
    ├── api/
    │   ├── html/                 # Inicio, cuenta, favoritos y prueba
    │   └── css/                  # Estilos compartidos y de página
    ├── assets/
    │   ├── i18n/                 # Textos disponibles
    │   ├── images/               # Imágenes y logo
    │   └── json/                 # Datos de destinos y usuarios demo
    ├── ui/                       # Interacciones de interfaz
    ├── utils/                    # Autenticación y utilidades
    ├── index.js                  # Búsqueda y tarjetas de destinos
    └── localStorage.js           # Favoritos del navegador
```