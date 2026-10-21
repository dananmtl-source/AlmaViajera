import {FilterUndefinedOrNull} from "./errors.js";
import data from '../assets/json/respuesta.json' with { type: "json" };

function llamadaRestCountries(filtro){
    try{
        if(filtro = undefined || filtro == null ){
            throw new FilterUndefinedOrNull();
        }
        console.log("llamamos a la api y nos responde con el json");
        let jsonRespuesta = data;
        return jsonRespuesta;
        // let urlCompuesta = `q=${filtro}`;
        // fetch(
        //     'https://api.restcountries.com/countries/v5?q=germ®ion=Europe',
        //     { headers: { 'Authorization': 'Bearer rc_live_9478358d0d984fa886c76ba31905d718' } }
        // )
        // .then(function (response) { return response.json(); })
        // .then(function (data) { console.log(data); });
    }catch(error){
        console.log("joTIO");
        console.error(error);
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
    }
    
}

function construirRespuesta(filtro){
    llamadaRestCountries(filtro);

}

console.log(llamadaRestCountries("españa"));