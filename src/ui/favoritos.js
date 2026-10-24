
// Buscamos el contenedor donde mostraremos los países favoritos.
const listaFavoritos = document.getElementById("lista-favoritos");

// Buscamos el mensaje que aparece cuando no hay favoritos.
const mensajeVacio = document.getElementById("mensaje-vacio");

// Creamos un array con varios países de prueba.
const paises = [
    {
        nombre: "Japón",
        capital: "Tokio",
        imagen: "https://flags.restcountries.com/v5/w320/jp.png"
    },
    {
        nombre: "Italia",
        capital: "Roma",
         imagen: "https://flags.restcountries.com/v5/w320/it.png"
    },
    {
        nombre: "Francia",
        capital: "París"
    },
    {
        nombre: "Portugal",
        capital: "Lisboa"
    },
    {
        nombre: "Noruega",
        capital: "Oslo"
    },
    {
        nombre: "Grecia",
        capital: "Atenas"
    }
];

// Recorremos el array para mostrar cada país.
paises.forEach(function(pais) {

    // Creamos una tarjeta para el país.
    const tarjeta = document.createElement("article");

    // Añadimos el nombre y la capital.
    tarjeta.innerHTML = `
        <img src="${pais.imagen}" alt="Bandera de ${pais.nombre}">
        <h3>${pais.nombre}</h3>
        <p>Capital: ${pais.capital}</p>
    `;

    // Introducimos la tarjeta en el contenedor de favoritos.
    listaFavoritos.appendChild(tarjeta);
});

// Ocultamos el mensaje porque ya hay países para mostrar.
mensajeVacio.style.display = "none";

// Comprobamos cuántos países y tarjetas tenemos.
console.log("Países del array:", paises.length);
console.log("Tarjetas creadas:", listaFavoritos.children.length);
