import { Visitor } from "./Visitor.js";
import { analizarLiterales,analizarLiteralesLower } from "../textoFunciones/funcFortran.js";
import {nLiterales,nUnion,nOpciones } from "../Nodo.js";
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
    /**  @param {nLiterales} nLiterales  @returns {string}*/
    visitNLiterales(nLiterales) {
        debugger;
        return nLiterales.i ? analizarLiteralesLower(nLiterales.str) : analizarLiterales(nLiterales.str);;
    }

    /**  @param {nUnion} nUnion  @returns {string}*/
    visitNUnion(nUnion) {
        return nUnion.exp.map(element => element.accept(this)).join('\n');
    }

    /**  @param {nOpciones} nOpciones  @returns {string}*/
    visitNOpciones(nOpciones){
        return nOpciones.union.map(element => element.accept(this)).join('\n');
    }
}