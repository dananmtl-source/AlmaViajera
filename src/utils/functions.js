// import { FilterUndefinedOrNull } from "./errors.js";
// import data from '../assets/json/respuesta.json' with { type: "json" };

//#region LlamadasAPI
let countriesCache = new Map();

class RespuestaDeLasAPIs {
    constructor(iso2, name, flag, phoneCode, currency, currencySymbol, currencyName, capital, latitude, longitude, region) {
        this.iso2 = iso2,
            this.name = name,
            this.flag = flag,
            this.phoneCode = phoneCode,
            this.currency = currency,
            this.currencySymbol = currencySymbol,
            this.currencyName = currencyName,
            this.capital = capital,
            this.latitude = latitude,
            this.longitude = longitude,
            this.region = region
    }
}

async function crearListaPaises(filtro) {
    let respuestaAPI = await llamadaRestCountries(filtro);

    return construirRespuesta(respuestaAPI.data);
}

//Esta función nos puede ser util si necesitamos esperar x tiempo a algún asincrono, llamada con: sleep(1000), el numero es el tiempo en milisegundos.
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//Función encargada de la llamada a la api, devuelve una respuesta con 
// -data (la información de los paises) 
// -meta (datos útiles para paginación como numero de elementos)
async function llamadaRestCountries() {
    try {
        let url = "https://api.apogeoapi.com/v1/countries";

        console.log("llamamos a la api y nos responde con el json");

        if (countriesCache.size < 0) return countriesCache;

        const res = await fetch(
            `https://api.apogeoapi.com/v1/countries`, {
            method: 'GET',
            headers: {
                'X-API-Key': 'apogeoapi_live_hWrP42CPz9TjqwI45nvFS6niffBRFyk3'
            }
        }
        );
        const data = await res.json();
        countriesCache = data;

        return data;

    } catch (error) {
        console.error(error);
        return error;
    }
}

//Función para preparar la información de la api encapsulada en nuestra clase. Devuelve una lista.
function construirRespuesta(datos) {
    try {
        let listaPaises = [];
        datos.forEach(element => {
            listaPaises.push(new RespuestaDeLasAPIs(
                element.iso2,
                element.name,
                element.emoji,
                element.phoneCode,
                element.currency,
                element.currencySymbol,
                element.currencyName,
                element.capital,
                element.latitude,
                element.longitude,
                element.region
            ))
        });
        return listaPaises;
    } catch (error) {
        console.error(error);
        return error;
    }
}

//#endregion

//#region LocalStorage

//Comprobamos si existe LocalStorage, si no existe lo creamos.
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./almacen');
}

function guardarLocalStorage(listaPaises) {
    listaPaises.forEach(element => {
        localStorage.setItem(element.iso2, JSON.stringify(element));
    })
}
function borrarLocalStorage(listaPaises) {
    listaPaises.forEach(element => {
        localStorage.removeItem(element.iso2);
    })
}

function leerLocalStorage() {
    let listaPaises = [];
    let keys = Object.keys(localStorage);
    let i = keys.length;

    while (i--) {
        listaPaises.push(JSON.parse(localStorage.getItem(keys[i])));
    }
    return listaPaises;
}

function limpiarLocalStorage() {
    localStorage.clear();
}

//#endregion

//#region Código para pruebas

async function testLocalStorage() {
    let listaPaises = [];

    listaPaises = await crearListaPaises();
    guardarLocalStorage(listaPaises);

}

//#endregion