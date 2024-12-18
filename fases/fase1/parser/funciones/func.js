
/** @param {number} tipo 0=multilinea 1=una linea @returns {string} retorna la funcion que hara el analisis de los comentarios en fortran */
export function funcAnalizarComentarios(tipo) {
    let str="!funcion comentarios en fortran\n";
    return str
}

/** @returns {string} retorna la funcion que hara el analisis de los identificadores en fortran */
export function funcIdentificador(){
    let str="!funcion identificador en fortran\n";
    return str
}

/** @returns {string} retorna la funcion que hara el analisis de los literales en fortran*/
export function funcLiterales(){
    let str="!funcion literales en fortran\n";
    return str
}

export default { funcAnalizarComentarios, funcIdentificador, funcLiterales };