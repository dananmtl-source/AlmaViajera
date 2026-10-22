import {FilterUndefinedOrNull} from "./errors.js";
import data from '../assets/json/respuesta.json' with { type: "json" };


let countriesCache = new Map();

class RespuestaDeLasAPIs{
    constructor(iso2, commonName, flagUrl, dialCode, currencyCode, currencySymbol){
        this.iso2 = iso2,
        this.commonName = commonName,
        this.flagUrl = flagUrl,
        this.dialCode = dialCode,
        this.currencyCode = currencyCode,
        this.currencySymbol = currencySymbol
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

function convertirRespuestaApiToJson(respuesta){
    let data = JSON.stringify(respuesta.data);
    let meta = JSON.stringify(respuesta.meta);
    return json;
}

async function simularIniciamosPeticionDeDatos(){
    let x = await llamadaRestCountries();
    respuesta = construirRespuesta(x.data);
    //return convertirRespuestaApiToJson(x);

}

function construirRespuesta(datos){
    const respuesta = new Map();
    let count = 0;
    datos.forEach(element => {
        respuesta.set(count,{nombre: element.commonName, bandera: element.flag, codigoPais: element.iso2})
        count++;
    });
    // const respuesta{
    //     commonName: nombre,
    //     flag: bandera,
    //     cioc: codigoPais
    // };
    let respuestaCountries = llamadaRestCountries();


// }