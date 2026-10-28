
// Importamos las funciones que necesitamos para gestionar los favoritos.
import {
    getFavoritesFromLocalStorage,
} from "../localStorage.js";


// Buscamos los elementos del HTML.
const listaFavoritos = document.getElementById("lista-favoritos");
const mensajeVacio = document.getElementById("mensaje-vacio");


// Mostramos los países favoritos en pantalla.
function mostrarFavoritos() {

    // Recuperamos los países guardados en localStorage.
    const favoritos = getFavoritesFromLocalStorage();

    // Limpiamos las tarjetas anteriores.
    listaFavoritos.replaceChildren();

    // Si no hay favoritos, mostramos el mensaje y terminamos.
    if (favoritos.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }

    // Si hay favoritos, ocultamos el mensaje.
    mensajeVacio.style.display = "none";

    // Creamos una tarjeta por cada país guardado.
    favoritos.forEach(function (pais) {

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("caja-pais");

        // Mostramos la bandera y el nombre del país.
        const titulo = document.createElement("h3");

        titulo.textContent =
            `${pais.datos?.flagEmoji ?? ""} ${pais.nombre}`.trim();

        // Mostramos la capital.
        const capital = document.createElement("p");

        capital.textContent =
            "Capital: " + (pais.datos?.capital || "No disponible");

        // Creamos el botón para quitar el país de favoritos.
        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Quitar de favoritos";

        // Eliminamos el país cuando se pulsa el botón.
        botonEliminar.addEventListener("click", function () {

            removeFavorite(pais);

            // Actualizamos las tarjetas y el mensaje.
            mostrarFavoritos();
        });

        // Añadimos los elementos a la tarjeta.
        tarjeta.append(titulo, capital, botonEliminar);

        // Mostramos la tarjeta en el HTML.
        listaFavoritos.appendChild(tarjeta);
    });
}


// Mostramos los favoritos al entrar en la página.
mostrarFavoritos();