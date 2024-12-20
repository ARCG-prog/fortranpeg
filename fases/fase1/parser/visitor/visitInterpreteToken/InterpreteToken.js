import { Visitor } from "./Visitor.js";
import { config } from "../../varGlobales/global.js";
import { analizarLiterales, analizarIdentificador } from "../textoFunciones/funcFortran.js";
import { NodoL } from "../../Lista/NodoL.js";
import { Lista } from "../../Lista/Lista.js";
import { nGramatica, nProducciones, nLiterales } from "../Nodo.js";
export default class InterpreteToken extends Visitor {
    constructor() {
        super();
    }
    //codigo solo para pruebas
    visitNodoU(nodo) {
        return `${nodo.a.accept(this)} ${nodo.str} ${nodo.b.accept(this)}`;
    }
    visitNodoD(nodo) {
        return `<DOS> ${nodo.str}`;
    }

    //codigo que si se utilizara
    visitnComentario(nComentario){
        return `<COMENTARIO> ${nComentario.str}`;
    }

    /**@param {nLiterales} nLiterales @returns {Lista}*/
    visitnLiterales(nLiterales) {
        if (!config.variables.gFuncionesCreadas.has("analizarLiterales")){
            config.variables.gFuncionesCreadas.set("analizarLiterales", analizarLiterales);
        }
        let nodoL= new NodoL();
        let lista = new Lista();
        nodoL.setCodigoFuncion(`analizarLiterales(txt, columna)`)
        lista.addUltimo(nodoL);
        return lista;
    }

    /**@param {nIdentificador} nIdentificador @returns {Lista} */
    visitnIdentificador(nIdentificador) {
        if (!config.variables.gFuncionesCreadas.has("analizarIdentificador")){
            config.variables.gFuncionesCreadas.set("analizarIdentificador", analizarIdentificador);
        }
        let lista = new Lista();
        let nodoL = new NodoL();
        nodoL.setCodigoFuncion(`analizarIdentificador(txt, columna)`);
        lista.addUltimo(nodoL);
        return lista;
    }

    /** @param {nProducciones} nProducciones  @returns {Lista}*/
    visitnProducciones(nProducciones) {
        let nodoL= new NodoL();
        //let lista = new Lista();
        /** @type {Lista}*/let listaId= nProducciones.id.accept(this);
        /** @type {Lista}*/let listaOp= nProducciones.op.accept(this);
        listaId.unirListaInicioFinal(listaId,listaOp);
        listaId.modificarSaltoFortran(listaId.ultimo.anterior,
            `
            res%resultado = alias
            res%tipoOpcion = -1
            `,
            `
            res%resultado = res%resultado !se guarda el resultado del texto
            res%tipoOpcion = res%tipoOpcion !se cambia ha las columnas que se avanzo
            globalState = globalState + 1
            `);
        return listaId;
    }

    visitnIgual(nIgual) {
        return new Lista();
    }

    /**@param {nGramatica} nGramatica @returns {Lista} */
    visitnGramatica(nGramatica) {
        /**@type {Lista|null}*/let lista=null
        for (const nodo of nGramatica.producciones) {
            /** @type {Lista} */
            lista=nodo.accept(this);
            debugger;
        }
        return lista;
    }
}