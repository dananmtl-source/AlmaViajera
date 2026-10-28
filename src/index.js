import { isInFavorites, toggleFavorite} from "./localStorage.js";


async function cargarDatos() {
    const respuesta = await fetch("/src/assets/json/respuesta.json");

    if (!respuesta.ok) {
        throw new Error(`Error al cargar el JSON: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    if (!Array.isArray(datos)) {
        throw new Error("El JSON de países no tiene el formato esperado");
    }

    return datos;
}

async function cargarDestinos() {
    const select = document.getElementById("destino");

    if (!(select instanceof HTMLSelectElement)) return;

    try {
        const datos = await cargarDatos();
        datos.forEach((pais) => {
            const option = document.createElement("option");
            option.value = pais.name;
            option.textContent = pais.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("No se pudieron mostrar los países", error);
        const option = document.createElement("option");
        option.textContent = "No se pudieron cargar los países";
        option.disabled = true;
        select.appendChild(option);
    }
}

function mostrarMensaje(section, mensaje) {
    const elemento = document.createElement("p");
    elemento.classList.add("mensaje-busqueda");
    elemento.setAttribute("role", "status");
    elemento.textContent = mensaje;
    section.appendChild(elemento);
}

function desplazarAResultados(section) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
    });
}

function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es")
        .trim();
}

async function buscar(event) {
    event?.preventDefault();

    const section = document.getElementById("resultadosDestinos");
    const select = document.getElementById("destino");
    const consulta = select?.value ?? "";

    if (!section) return;

    section.replaceChildren();

    // Carga de ciudades
    try {
        const datos = await cargarDatos();
        const termino = normalizarTexto(consulta);
        const resultados = datos.filter((pais) => {
            const campos = [
                pais.name,
                pais.datos.commonName,
                pais.datos.officialName,
                pais.datos.nativeName,
                pais.datos.iso2,
                pais.datos.iso3,
                pais.datos.capital,
                pais.datos.region,
                pais.datos.subregion,
                ...(pais.datos.languages ?? []),
                pais.datos.currencyName,
                pais.datos.currencyCode,
            ];

            return campos.some((campo) =>
                normalizarTexto(String(campo ?? "")).includes(termino)
            );
        });

        if (resultados.length === 0) {
            mostrarMensaje(section, "No encontramos destinos relacionados con esa búsqueda. Prueba con otro país.");
            desplazarAResultados(section);
            return;
        }

        // Creación de estructura
        resultados.forEach((pais) => {
            const encabezado = document.createElement("h2");
            encabezado.textContent = `${pais.datos.flagEmoji ?? ""} ${pais.name}`.trim();
            section.appendChild(encabezado);

            (pais.ciudades ?? []).forEach((ciudad) => {
                const tarjeta = document.createElement("section");
                const titulo = document.createElement("h3");
                const descripcion = document.createElement("p");
                const temporada = document.createElement("p");
                const lugares = document.createElement("ul");

                tarjeta.classList.add("destino");
                tarjeta.setAttribute("aria-label", ciudad.name);
                titulo.textContent = ciudad.name;
                descripcion.textContent = ciudad.descripcion;
                temporada.textContent = `Mejor temporada para viajar: ${ciudad.mejorTemporada}`;

                (ciudad.lugaresDestacados ?? []).forEach((lugar) => {
                    const elemento = document.createElement("li");
                    elemento.textContent = lugar;
                    lugares.appendChild(elemento);
                });

                const lugaresTitulo = document.createElement("h4");
                lugaresTitulo.textContent = "Qué visitar";

                const favoriteButton = document.createElement("button");
                favoriteButton.type = "button";
                const isFavorite = isInFavorites(ciudad.name);

                if (isFavorite) {
                    favoriteButton.classList.add("favorite");
                    favoriteButton.textContent = "♥ En favoritos";
                } else {
                    favoriteButton.textContent = "♡ Guardar en favoritos";
                }
                favoriteButton.setAttribute("aria-pressed", String(isFavorite));
                favoriteButton.setAttribute(
                    "aria-label",
                    `${isFavorite ? "Quitar" : "Añadir"} ${ciudad.name} ${isFavorite ? "de" : "a"} favoritos`
                );

                favoriteButton.addEventListener("click", () => {
                    const isFavorite = toggleFavorite(ciudad.name);
                    if (isFavorite) {
                        favoriteButton.classList.add("favorite");
                        favoriteButton.textContent = "♥ En favoritos";
                    } else {
                        favoriteButton.classList.remove("favorite");
                        favoriteButton.textContent = "♡ Guardar en favoritos";
                    }
                    favoriteButton.setAttribute("aria-pressed", String(isFavorite));
                    favoriteButton.setAttribute(
                        "aria-label",
                        `${isFavorite ? "Quitar" : "Añadir"} ${ciudad.name} ${isFavorite ? "de" : "a"} favoritos`
                    );
                })
                tarjeta.append(
                    titulo,
                    descripcion,
                    temporada,
                    lugaresTitulo,
                    lugares,
                    favoriteButton
                );
                section.appendChild(tarjeta);
            });
        });
        desplazarAResultados(section);
    } catch (error) {
        console.error("No se pudieron buscar los destinos", error);
        mostrarMensaje(section, "No se pudieron cargar los resultados. Inténtalo de nuevo.");
        desplazarAResultados(section);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarDestinos();
    document.getElementById("formBusqueda")?.addEventListener("submit", buscar);
});

export { buscar }
