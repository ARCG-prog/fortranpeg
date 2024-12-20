import { Visitor } from "./Visitor.js";
import { analizarLiterales,analizarLiteralesLower } from "../textoFunciones/funcFortran.js";
import {nLiterales,nUnion,nOpciones } from "../Nodo.js";
import { tipoLiteral,NodoTipo,tipoTokenaizer } from "./NodoTipo.js";


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
    /**  @param {nLiterales} nLiterales  @returns {}*/
    visitNLiterales(nLiterales) {
        let literal = new tipoLiteral();
        literal.setAll(nLiterales.str, nLiterales.i);
        return literal;
        //return nLiterales.i ? analizarLiteralesLower(nLiterales.str) : analizarLiterales(nLiterales.str);
    }

    /**  @param {nUnion} nUnion  @returns {}*/
    visitNUnion(nUnion) {
        debugger;
        const resultado = [].concat(...nUnion.exp.map(element => element.accept(this)));
        return resultado;
    }

    /**  @param {nOpciones} nOpciones  @returns {}*/
    visitNOpciones(nOpciones){
        const resultado = [].concat(...nOpciones.union.map(element => element.accept(this)));
        return resultado;
    }

    /**  @param {nProducciones} nProducciones  @returns {}*/
    visitNProducciones(nProducciones) {
        //return `module ${nProducciones.id}`;
        let res = new tipoTokenaizer();
        debugger;
        let nodosTipo= nProducciones.opciones.accept(this);
        nodosTipo.forEach(element => {
            res.str +=element.escribir();
        });
        return [res];
    }
}