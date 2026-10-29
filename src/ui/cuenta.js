const STORAGE_KEY = "cuentasUsuario";
const sessionString = localStorage.getItem("sesion") || sessionStorage.getItem("sesion");

const avatar = document.getElementById("avatar");
const nombreUsuario = document.getElementById("nombre-usuario");
const emailUsuario = document.getElementById("email-usuario");
const formDatos = document.getElementById("form-datos");
const formPreferencias = document.getElementById("form-preferencias");
const formPassword = document.getElementById("form-password");

let sesion;
let cuentaBase;
let cuentaActualizada;

function mostrarMensaje(id, texto, tipo = "success") {
    const mensaje = document.getElementById(id);
    if (!(mensaje instanceof HTMLElement)) return;

    mensaje.textContent = texto;
    mensaje.dataset.tipo = tipo;
}

function leerCuentasGuardadas() {
    const cuentas = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (!cuentas || typeof cuentas !== "object" || Array.isArray(cuentas)) {
        throw new Error("Los datos guardados de las cuentas no tienen un formato válido");
    }
    return cuentas;
}

function guardarCuenta() {
    const cuentas = leerCuentasGuardadas();
    cuentas[sesion.usuario] = cuentaActualizada;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cuentas));
}

function guardarSesionActualizada() {
    const storage = localStorage.getItem("sesion") ? localStorage : sessionStorage;
    storage.setItem("sesion", JSON.stringify({
        ...sesion,
        nombre: [cuentaActualizada.nombre, cuentaActualizada.apellidos]
            .filter(Boolean)
            .join(" "),
    }));
    sesion = JSON.parse(storage.getItem("sesion"));
}

function mostrarPerfil() {
    const nombreCompleto = [cuentaActualizada.nombre, cuentaActualizada.apellidos]
        .filter(Boolean)
        .join(" ");

    if (nombreUsuario) {
        nombreUsuario.textContent = nombreCompleto || sesion.usuario;
    }
    if (emailUsuario) {
        emailUsuario.textContent = cuentaActualizada.email || "Añade un correo electrónico a tu perfil";
    }

    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const email = document.getElementById("email");
    if (nombre instanceof HTMLInputElement) nombre.value = cuentaActualizada.nombre ?? "";
    if (apellidos instanceof HTMLInputElement) apellidos.value = cuentaActualizada.apellidos ?? "";
    if (email instanceof HTMLInputElement) email.value = cuentaActualizada.email ?? "";

    if (avatar instanceof HTMLImageElement && cuentaActualizada.avatar) {
        avatar.src = cuentaActualizada.avatar;
    }

    const idioma = document.getElementById("idioma");
    const tema = document.getElementById("tema");
    if (idioma instanceof HTMLSelectElement && cuentaActualizada.preferencias?.idioma) {
        idioma.value = cuentaActualizada.preferencias.idioma;
    }
    if (tema instanceof HTMLSelectElement && cuentaActualizada.preferencias?.tema) {
        tema.value = cuentaActualizada.preferencias.tema;
    }
    document.body.dataset.theme = cuentaActualizada.preferencias?.tema ?? "claro";
}

async function inicializarCuenta() {
    if (!sessionString) return;

    try {
        sesion = JSON.parse(sessionString);
        if (!sesion?.usuario) {
            throw new Error("La sesión no contiene un usuario válido");
        }

        const usersUrl = new URL("../assets/json/users.json", import.meta.url);
        const response = await fetch(usersUrl);
        if (!response.ok) {
            throw new Error(`No se pudieron cargar los datos de usuario: ${response.status}`);
        }

        const users = await response.json();
        if (!Array.isArray(users)) {
            throw new Error("El archivo de usuarios no contiene una lista válida");
        }

        cuentaBase = users.find((user) => user.usuario === sesion.usuario);
        if (!cuentaBase) {
            throw new Error("No se encontró el usuario de la sesión");
        }

        const cuentas = leerCuentasGuardadas();
        cuentaActualizada = {
            ...cuentaBase,
            ...(cuentas[sesion.usuario] ?? {}),
            preferencias: {
                ...(cuentas[sesion.usuario]?.preferencias ?? {}),
            },
        };
        mostrarPerfil();
    } catch (error) {
        console.error("No se pudo cargar el perfil", error);
        mostrarMensaje("mensaje-datos", "No se pudieron cargar los datos de la cuenta.", "error");
    }
}

formDatos?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cuentaActualizada) return;

    const formData = new FormData(formDatos);
    cuentaActualizada.nombre = String(formData.get("nombre") ?? "").trim();
    cuentaActualizada.apellidos = String(formData.get("apellidos") ?? "").trim();
    cuentaActualizada.email = String(formData.get("email") ?? "").trim();

    try {
        guardarCuenta();
        guardarSesionActualizada();
        mostrarPerfil();
        mostrarMensaje("mensaje-datos", "Tus datos personales se han guardado.");
    } catch (error) {
        console.error("No se pudieron guardar los datos personales", error);
        mostrarMensaje("mensaje-datos", "No se pudieron guardar los cambios.", "error");
    }
});

formPreferencias?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cuentaActualizada) return;

    const formData = new FormData(formPreferencias);
    cuentaActualizada.preferencias = {
        idioma: String(formData.get("idioma") ?? "es"),
        tema: String(formData.get("tema") ?? "claro"),
    };

    try {
        guardarCuenta();
        document.body.dataset.theme = cuentaActualizada.preferencias.tema;
        mostrarMensaje("mensaje-preferencias", "Tus preferencias se han guardado.");
    } catch (error) {
        console.error("No se pudieron guardar las preferencias", error);
        mostrarMensaje("mensaje-preferencias", "No se pudieron guardar las preferencias.", "error");
    }
});

formPassword?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cuentaActualizada || !cuentaBase) return;

    const actual = document.getElementById("password-actual");
    const nueva = document.getElementById("password-nueva");
    const repetir = document.getElementById("password-repetir");
    if (
        !(actual instanceof HTMLInputElement)
        || !(nueva instanceof HTMLInputElement)
        || !(repetir instanceof HTMLInputElement)
    ) {
        return;
    }

    if (actual.value !== cuentaActualizada.password) {
        mostrarMensaje("mensaje-password", "La contraseña actual no es correcta.", "error");
        return;
    }
    if (nueva.value !== repetir.value) {
        mostrarMensaje("mensaje-password", "Las contraseñas nuevas no coinciden.", "error");
        return;
    }

    cuentaActualizada.password = nueva.value;
    try {
        guardarCuenta();
        formPassword.reset();
        mostrarMensaje("mensaje-password", "La contraseña se ha cambiado correctamente.");
    } catch (error) {
        console.error("No se pudo cambiar la contraseña", error);
        mostrarMensaje("mensaje-password", "No se pudo guardar la nueva contraseña.", "error");
    }
});

document.getElementById("foto")?.addEventListener("change", (event) => {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement) || !cuentaActualizada) return;

    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        mostrarMensaje("mensaje-foto", "Selecciona un archivo de imagen.", "error");
        input.value = "";
        return;
    }
    if (file.size > 1_000_000) {
        mostrarMensaje("mensaje-foto", "La imagen debe ocupar menos de 1 MB.", "error");
        input.value = "";
        return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        if (typeof reader.result !== "string" || !(avatar instanceof HTMLImageElement)) {
            mostrarMensaje("mensaje-foto", "No se pudo leer la imagen.", "error");
            return;
        }

        cuentaActualizada.avatar = reader.result;
        try {
            guardarCuenta();
            avatar.src = reader.result;
            mostrarMensaje("mensaje-foto", "La foto de perfil se ha actualizado.");
        } catch (error) {
            console.error("No se pudo guardar la foto de perfil", error);
            mostrarMensaje("mensaje-foto", "No se pudo guardar la imagen en este navegador.", "error");
        }
    });
    reader.addEventListener("error", () => {
        mostrarMensaje("mensaje-foto", "No se pudo leer la imagen.", "error");
    });
    reader.readAsDataURL(file);
});

inicializarCuenta();
