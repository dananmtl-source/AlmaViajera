
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

export async function crearListaPaisesByName(filtro) {
    let respuestaAPI = await llamadaRestCountriesByName();

    return construirRespuesta(respuestaAPI.data);
}

export async function crearListaPaises() {
    let respuestaAPI = await llamadaRestCountries();

    return construirRespuesta(respuestaAPI.data);
}

//Función encargada de la llamada a la api, devuelve una respuesta con 
// -data (la información de los paises) 
// -meta (datos útiles para paginación como numero de elementos)
async function llamadaRestCountriesByName(filtro) {
    try {
        const apiUrl = "https://api.apogeoapi.com/v1/countries/search";
        let url = new URL(apiUrl);
        if(filtro != undefined && filtro.length>0){
            url.searchParams.set("q",filtro);
        }
        if (countriesCache.size > 0) return countriesCache;

        const res = await fetch(
            url, {
            headers: {
                'X-API-Key': 'apogeoapi_live_hWrP42CPz9TjqwI45nvFS6niffBRFyk3'
            }
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

async function llamadaRestCountries() {
    try {
        const apiUrl = "https://api.apogeoapi.com/v1/countries";
        let url = new URL(apiUrl);

        const res = await fetch(
            url, {
            headers: {
                'X-API-Key': 'apogeoapi_live_hWrP42CPz9TjqwI45nvFS6niffBRFyk3'
            }
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

