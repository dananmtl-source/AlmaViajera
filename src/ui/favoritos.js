
// Importamos las funciones que gestionan los favoritos.
import {
    getFavoritesFromLocalStorage,
    removeFavorite
} from "../api/favoritosStorage.js";


// Buscamos el contenedor donde mostraremos los países favoritos.
const listaFavoritos = document.getElementById("lista-favoritos");

// Buscamos el mensaje que aparece cuando no hay favoritos.
const mensajeVacio = document.getElementById("mensaje-vacio");


// Mostramos los países favoritos en pantalla.
function mostrarFavoritos() {

    // Recuperamos los países guardados.
    const favoritos = getFavoritesFromLocalStorage();

    // Limpiamos el contenedor antes de crear las tarjetas.
    listaFavoritos.replaceChildren();

    // Si no hay favoritos, mostramos el mensaje y terminamos.
    if (favoritos.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }

    // Si hay favoritos, ocultamos el mensaje.
    mensajeVacio.style.display = "none";

    // Recorremos los países guardados.
    favoritos.forEach(function(pais) {

        // Creamos una tarjeta para cada país.
        const tarjeta = document.createElement("article");

        // Aplicamos los estilos definidos en favoritos.css.
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

        // Al pulsar el botón, eliminamos el país.
        botonEliminar.addEventListener("click", function() {

            removeFavorite(pais);

            // Volvemos a mostrar la lista actualizada.
            mostrarFavoritos();
        });

        // Añadimos el contenido a la tarjeta.
        tarjeta.append(titulo, capital, botonEliminar);

        // Añadimos la tarjeta al contenedor.
        listaFavoritos.appendChild(tarjeta);
    });
}


// Mostramos los favoritos al entrar en la página.
mostrarFavoritos();
