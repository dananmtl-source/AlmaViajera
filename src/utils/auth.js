function obtenerSesion() {
  return JSON.parse(
    localStorage.getItem("sesion") ||
      sessionStorage.getItem("sesion") ||
      "null"
  );
}

function cerrarSesion() {
  localStorage.removeItem("sesion");
  sessionStorage.removeItem("sesion");
  window.location.href = "../../../index.html";
}

if (!obtenerSesion()) {
  window.location.replace("../../../index.html");
}