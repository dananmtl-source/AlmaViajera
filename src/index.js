const rutaDatos = new URL("./assets/json/respuesta.json", document.currentScript.src);

async function cargarDatos() {
    const respuesta = await fetch(rutaDatos);

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
            option.value = pais.nombre;
            option.textContent = pais.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("No se pudieron mostrar los países", error);
    }
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
    const entrada = document.getElementById("busquedaPais");
    const select = document.getElementById("destino");
    const consulta = entrada?.value ?? select?.value ?? "";

    if (!section) return;

    section.replaceChildren();

    if (!consulta.trim()) {
        section.textContent = "Escribe un país, capital, idioma o moneda para buscar.";
        return;
    }

    try {
        const datos = await cargarDatos();
        const termino = normalizarTexto(consulta);
        const resultados = datos.filter((pais) => {
            const campos = [
                pais.nombre,
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
            section.textContent = "No se encontraron destinos relacionados con la búsqueda.";
            return;
        }

        resultados.forEach((pais) => {
            const encabezado = document.createElement("h2");
            encabezado.textContent = `${pais.datos.flagEmoji ?? ""} ${pais.nombre}`.trim();
            section.appendChild(encabezado);

            (pais.ciudades ?? []).forEach((ciudad) => {
                const tarjeta = document.createElement("section");
                const titulo = document.createElement("h3");
                const descripcion = document.createElement("p");
                const temporada = document.createElement("p");
                const lugares = document.createElement("ul");

                tarjeta.classList.add("destino");
                tarjeta.setAttribute("aria-label", ciudad.nombre);
                titulo.textContent = ciudad.nombre;
                descripcion.textContent = ciudad.descripcion;
                temporada.textContent = `Mejor temporada para viajar: ${ciudad.mejorTemporada}`;

                (ciudad.lugaresDestacados ?? []).forEach((lugar) => {
                    const elemento = document.createElement("li");
                    elemento.textContent = lugar;
                    lugares.appendChild(elemento);
                });

                const lugaresTitulo = document.createElement("h4");
                lugaresTitulo.textContent = "Qué visitar";
                tarjeta.append(titulo, descripcion, temporada, lugaresTitulo, lugares);
                section.appendChild(tarjeta);
            });
        });
    } catch (error) {
        console.error("No se pudieron buscar los destinos", error);
        section.textContent = "No se pudieron cargar los resultados. Inténtalo de nuevo.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarDestinos();
    document
        .getElementById("formularioBusqueda")
        ?.addEventListener("submit", buscar);
});
