import {FilterUndefinedOrNull} from "./errors.js";
import data from '../assets/json/respuesta.json' with { type: "json" };


let countriesCache = new Map();

class RespuestaDeLasAPIs{
    constructor(iso2, name, flag, phoneCode, currency, currencySymbol, currencyName, capital, latitude, longitude, region){
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function llamadaRestCountries(){
    try{
        let url = "https://api.apogeoapi.com/v1/countries";

        console.log("llamamos a la api y nos responde con el json");
        // let jsonRespuesta = data;   
        // return jsonRespuesta;

        if (countriesCache.size < 0) return countriesCache;

        const res = await fetch(
            `https://api.apogeoapi.com/v1/countries`,{
                method: 'GET',
                headers: {
                    'X-API-Key': 'apogeoapi_live_hWrP42CPz9TjqwI45nvFS6niffBRFyk3'
                }
            }
        );
        const data = await res.json();
        countriesCache = data;
        
        return data;

    }catch(error){
        console.error(error);
        return error;
    }
}

// function convertirRespuestaApiToJson(respuesta){
//     let data = JSON.stringify(respuesta.data);
//     let meta = JSON.stringify(respuesta.meta);
//     return json;
// }

async function simularIniciamosPeticionDeDatos(){
    let respuestaAPI = await llamadaRestCountries();
    respuesta = construirRespuesta(respuestaAPI.data);
    //return convertirRespuestaApiToJson(x);

}

//
function construirRespuesta(datos){
    const respuesta = new Map();
    let count = 0;
    datos.forEach(element => {
        
    });
    return respuesta;
 }

 simularIniciamosPeticionDeDatos();