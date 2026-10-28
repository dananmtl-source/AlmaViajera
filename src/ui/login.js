
                                   

const formLogin = document.getElementById("login");
const inputUsuario = document.getElementById("usuario");
const inputContra = document.getElementById("contrasena");
const inputRemember = document.getElementById("remember");
const loginError = document.getElementById("loginError");


formLogin.addEventListener("submit", async (event) => {
  event.preventDefault();
 
  loginError.textContent = "";


  const usuario = inputUsuario.value.trim();
  const password = inputContra.value;

  try {

    const response = await fetch("src/assets/json/users.json");
    const users = await response.json();


    const user = users.find(
      (u) => u.usuario === usuario && u.password === password
    );

    if (!user) {
      loginError.textContent = "Usuario o contraseña incorrectos";
      return;
    }

    const sesion = JSON.stringify({
      usuario: user.usuario,
      nombre: user.nombre,
    });

    const storage = inputRemember.checked ? localStorage : sessionStorage;
    storage.setItem("sesion", sesion);


    window.location.href = "src/api/html/inicio.html";
  } catch (error) {
    console.error(error);
    loginError.textContent = "Error al intentar iniciar sesión";
  }
});

[inputUsuario, inputContra].forEach((input) => {
  input.addEventListener("input", () => {
    loginError.textContent = "";
  });
});

