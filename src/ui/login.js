const formLogin = document.getElementById("login");
const inputUsuario = document.getElementById("usuario");
const inputContra = document.getElementById("contrasena");
const inputRemember = document.getElementById("remember");
const loginError = document.getElementById("loginError");

function cargarCuentasGuardadas() {
    const cuentas = JSON.parse(localStorage.getItem("cuentasUsuario") || "{}");
    if (!cuentas || typeof cuentas !== "object" || Array.isArray(cuentas)) {
        throw new Error("Los datos de cuenta guardados no tienen un formato válido");
    }
    return cuentas;
}

if (
    formLogin instanceof HTMLFormElement
    && inputUsuario instanceof HTMLInputElement
    && inputContra instanceof HTMLInputElement
    && inputRemember instanceof HTMLInputElement
    && loginError instanceof HTMLElement
) {
    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault();
        loginError.textContent = "";

        const usuario = inputUsuario.value.trim();
        const password = inputContra.value;

        try {
            const usersUrl = new URL("../assets/json/users.json", import.meta.url);
            const response = await fetch(usersUrl);
            if (!response.ok) {
                throw new Error(`No se pudieron cargar las cuentas: ${response.status}`);
            }

            const users = await response.json();
            if (!Array.isArray(users)) {
                throw new Error("El archivo de cuentas no contiene una lista válida");
            }

            const cuentasGuardadas = cargarCuentasGuardadas();
            const user = users.find((cuenta) => {
                const cambios = cuentasGuardadas[cuenta.usuario];
                return cuenta.usuario === usuario
                    && (cambios?.password ?? cuenta.password) === password;
            });

            if (!user) {
                loginError.textContent = "Usuario o contraseña incorrectos";
                return;
            }

            const cambios = cuentasGuardadas[user.usuario] ?? {};
            const nombre = cambios.nombre ?? user.nombre;
            const sesion = JSON.stringify({
                usuario: user.usuario,
                nombre,
            });
            const storage = inputRemember.checked ? localStorage : sessionStorage;
            const otroStorage = inputRemember.checked ? sessionStorage : localStorage;

            otroStorage.removeItem("sesion");
            storage.setItem("sesion", sesion);
            window.location.assign(new URL("../api/html/inicio.html", import.meta.url));
        } catch (error) {
            console.error("No se pudo iniciar sesión", error);
            loginError.textContent = "No se pudo iniciar sesión. Inténtalo de nuevo.";
        }
    });

    [inputUsuario, inputContra].forEach((input) => {
        input.addEventListener("input", () => {
            loginError.textContent = "";
        });
    });
}
