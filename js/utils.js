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

        console.log("llamamos a la api y nos responde con el json");
        // let jsonRespuesta = data;   
        // return jsonRespuesta;

        if (countriesCache.size < 0) return countriesCache;

        const res = await fetch(
            `https://api.apogeoapi.com/v1/countries?apikey=apogeoapi_live_WO4hOborQVnUZsFOn91bq7OI3CyQZkfR`
        );
        await sleep(10000);
        let data = await res.json();
        
        countriesCache = data;
        return data;
    }catch(error){
        console.error(error);
        return error;
    }
}

function llamadaRestCurrencies(){
    try{
        // if(filtro = undefined || filtro == null ){
        //     throw new FilterUndefinedOrNull();
        // }
        // console.log("llamamos a la api y nos responde con el json");
        // let jsonRespuesta = data;
        // return jsonRespuesta;

        let urlCompuesta = `q=${filtro}`;
        fetch(
            'https://api.restcountries.com/currencies/v1?q=germ®ion=Europe',
            { headers: { 'Authorization': 'Bearer rc_live_9478358d0d984fa886c76ba31905d718' } }
        )
        .then(function (response) { return response.json(); })
        .then(function (data) { console.log(data); });
    }catch(error){
        console.log("joTIO");
        console.error(error);
        return error;
    }
}

// function construirRespuesta(filtro){
//     const respuesta{
//         commonName: nombre,
//         flag: bandera,
//         cioc: codigoPais
//     };
//     let respuestaCountries = llamadaRestCountries();


// }

console.log(llamadaRestCountries());