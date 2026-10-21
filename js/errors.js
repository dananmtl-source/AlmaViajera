class FilterUndefinedOrNull extends Error {
    constructor() {
        super("No se reconoce el filtro");
        this.name = "FilterUndefinedOrNull";
    }
}


export {
    FilterUndefinedOrNull
}