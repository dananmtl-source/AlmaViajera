// Importamos las funciones que necesitamos para gestionar los favoritos.
import { isInFavorites, toggleFavorite, getFavoritesFromLocalStorage } from "../localStorage.js";


// Buscamos los elementos del HTML.
const listaFavoritos = document.getElementById("lista-favoritos");
const contadorFavoritos = document.getElementById("contador-favoritos");
const mensajeVacio = document.getElementById("mensaje-vacio");
const errorFavoritos = document.getElementById("error-favoritos");

async function cargarDestinos() {
    const url = new URL("../assets/json/respuesta.json", import.meta.url);
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`Error al cargar los destinos: ${respuesta.status}`);
    }

    const destinos = await respuesta.json();
    if (!Array.isArray(destinos)) {
        throw new Error("El archivo de destinos no contiene una lista válida");
    }

    return destinos;
}

function crearTarjeta(ciudadNombre, destinos) {
    const pais = destinos.find((destino) =>
        destino.ciudades?.some((ciudad) => ciudad.name === ciudadNombre)
    );
    const ciudad = pais?.ciudades?.find((destino) => destino.name === ciudadNombre);

    const tarjeta = document.createElement("article");
    tarjeta.classList.add("caja-pais");

    const cabecera = document.createElement("div");
    cabecera.classList.add("caja-pais-cabecera");

    const bandera = document.createElement("span");
    bandera.classList.add("favorito-bandera");
    bandera.setAttribute("aria-hidden", "true");
    bandera.textContent = pais?.datos?.flagEmoji ?? "✦";

    const paisNombre = document.createElement("p");
    paisNombre.classList.add("favorito-pais");
    paisNombre.textContent = pais?.name ?? "Destino guardado";
    cabecera.append(bandera, paisNombre);

    const titulo = document.createElement("h3");
    titulo.textContent = ciudadNombre;

    const descripcion = document.createElement("p");
    descripcion.classList.add("favorito-descripcion");
    descripcion.textContent = ciudad?.descripcion
        ?? "Este destino sigue en tu lista. Explora más lugares para planificar tu próximo viaje.";

    tarjeta.append(cabecera, titulo, descripcion);

    if (ciudad?.mejorTemporada) {
        const temporada = document.createElement("p");
        temporada.classList.add("favorito-temporada");
        temporada.textContent = `Mejor temporada: ${ciudad.mejorTemporada}`;
        tarjeta.appendChild(temporada);
    }

    if (ciudad?.lugaresDestacados?.length) {
        const lugares = document.createElement("div");
        lugares.classList.add("favorito-lugares");

        const lugaresTitulo = document.createElement("h4");
        lugaresTitulo.textContent = "No te pierdas";

        const listaLugares = document.createElement("ul");
        ciudad.lugaresDestacados.slice(0, 3).forEach((lugar) => {
            const elemento = document.createElement("li");
            elemento.textContent = lugar;
            listaLugares.appendChild(elemento);
        });

        lugares.append(lugaresTitulo, listaLugares);
        tarjeta.appendChild(lugares);
    }

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Quitar de favoritos";
    botonEliminar.setAttribute("aria-label", `Quitar ${ciudadNombre} de favoritos`);
    botonEliminar.addEventListener("click", () => {
        toggleFavorite(ciudadNombre);
        mostrarFavoritos();
    });

    tarjeta.appendChild(botonEliminar);
    return tarjeta;
}

async function mostrarFavoritos() {
    if (
        !(listaFavoritos instanceof HTMLElement)
        || !(contadorFavoritos instanceof HTMLElement)
        || !(mensajeVacio instanceof HTMLElement)
        || !(errorFavoritos instanceof HTMLElement)
    ) {
        return;
    }

    listaFavoritos.replaceChildren();
    errorFavoritos.hidden = true;

    try {
        const favoritos = getFavoritesFromLocalStorage();
        if (!Array.isArray(favoritos)) {
            throw new Error("La lista guardada de favoritos no tiene un formato válido");
        }

        const total = favoritos.length;
        contadorFavoritos.textContent = `${total} ${total === 1 ? "destino guardado" : "destinos guardados"}`;
        mensajeVacio.hidden = total !== 0;

        if (total === 0) return;

        let destinos = [];
        try {
            destinos = await cargarDestinos();
        } catch (error) {
            console.error("No se pudieron cargar los detalles de los destinos", error);
            errorFavoritos.textContent = "No se pudieron cargar los detalles de los destinos. Tus favoritos siguen guardados.";
            errorFavoritos.hidden = false;
        }

        favoritos.forEach((ciudad) => {
            listaFavoritos.appendChild(crearTarjeta(ciudad, destinos));
        });
    } catch (error) {
        console.error("No se pudieron mostrar los favoritos", error);
        contadorFavoritos.textContent = "";
        mensajeVacio.hidden = true;
        errorFavoritos.textContent = "No se pudo leer la lista de favoritos. Inténtalo de nuevo.";
        errorFavoritos.hidden = false;
    }
}

document.addEventListener("DOMContentLoaded", mostrarFavoritos);
