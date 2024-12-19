// Crear y exportar el Map global
export const globalFuncionesCreadas = new Map();


function a(){
    if (globalFuncionesCreadas.has("comentarios")) {
        globalFuncionesCreadas.get("comentarios", "funtion comentario(txt,columna){return txt;}");
    }
    return "funcion(txt,columna);"
}
