// import { FilterUndefinedOrNull } from "./errors.js";
// import data from '../assets/json/respuesta.json' with { type: "json" };


export async function construirHtmlConListaPaises() {
    let listaPaises = [];
    listaPaises = await crearListaPaises();

    construirHtml(listaPaises);
}


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

//Esta función nos puede ser util si necesitamos esperar x tiempo a algún asincrono, llamada con: sleep(1000), el numero es el tiempo en milisegundos.
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function crearListaPaises() {
    let respuestaAPI = await llamadaRestCountries();

    return construirRespuesta(respuestaAPI.data);
}

//Función encargada de la llamada a la api, devuelve una respuesta con 
// -data (la información de los paises) 
// -meta (datos útiles para paginación como numero de elementos)
async function llamadaRestCountries() {
    try {
        let url = "https://api.apogeoapi.com/v1/countries";

        if (countriesCache.size > 0) return countriesCache;

        const res = await fetch(
            url, {
            headers: {
                'X-API-Key': 'apogeoapi_live_hWrP42CPz9TjqwI45nvFS6niffBRFyk3',
                'Access-Control-Allow-Origin': 'https://api.apogeoapi.com'
            },
            mode:"no-cors"
        }
        );
        if(!res.ok){
            throw new Error(res.statusText);
        }
        const data = await res.json();
        countriesCache = data;

        return data;

    } catch (error) {
        console.error("Error al llamar a la API: ",error);
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
                element.flagUrl,
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
// if (typeof localStorage === "undefined" || localStorage === null) {
//     //let LocalStorage = require('node-localstorage').LocalStorage;
//     let localStorage = new LocalStorage('./almacen');
// }

// function guardarLocalStorage(listaPaises) {
//     listaPaises.forEach(element => {
//         localStorage.setItem(element.iso2, JSON.stringify(element));
//     })
// }
// function borrarLocalStorage(listaPaises) {
//     listaPaises.forEach(element => {
//         localStorage.removeItem(element.iso2);
//     })
// }

// function leerLocalStorage() {
//     let listaPaises = [];
//     let keys = Object.keys(localStorage);
//     let i = keys.length;

//     while (i--) {
//         listaPaises.push(JSON.parse(localStorage.getItem(keys[i])));
//     }
//     return listaPaises;
// }

// function limpiarLocalStorage() {
//     localStorage.clear();
// }

//#endregion

//#region DOM

function construirHtml(listaPaises) {
    // listaPaises.finally(() => {
    //     console.log("Experiment completed");

        
        
    // });
    
    //const ul = document.getElementById("testUl");
        let count = 0;
        listaPaises.forEach(element => {
            count++;
            let li = document.createElement("li");
            let img = document.createElement("img");
            let p = document.createElement("p");
            
            li.setAttribute("id", `li${count}`);
            img.setAttribute("id", `img${count}`);
            p.setAttribute("id", `p${count}`);

            img.setAttribute("src", `${element.flagUrl}`);
            p.appendChild(document.createTextNode(element.name));

            ul.appendChild(li);
            li.appendChild(img);
            li.appendChild(p);
        })
}


//#endregion


console.log(construirHtmlConListaPaises());

//#region Código para pruebas

// async function testLocalStorage() {
//     let listaPaises = [];

//     listaPaises = await crearListaPaises();
//     guardarLocalStorage(listaPaises);

// }

//#endregion