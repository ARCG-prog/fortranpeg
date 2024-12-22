import { Visitor } from "./Visitor.js";
import { analizarLiterales,analizarLiteralesLower } from "../textoFunciones/funcFortran.js";
import {nLiterales,nUnion,nOpciones,nPunto,nExpresion } from "../Nodo.js";
import { tipoLiteral,NodoTipo,tipoTokenaizer,tipoPunto,tipoCuantificador} from "../textoFunciones/NodoTipo.js";


export default class InterpreteToken extends Visitor {
    constructor() {
        super();
    }
    //codigo solo para pruebas
    visitNodoU(nodo) {
        return new NodoTipo();
    }
    visitNodoD(nodo) {
        return new NodoTipo();
    }


    //codigo que si se utilizara
    /**  @param {nLiterales} nLiterales  @returns {}*/
    visitNLiterales(nLiterales) {
        let literal = new tipoLiteral();
        literal.setAll(nLiterales.str, nLiterales.i);
        return literal;
    }

    /**  @param {nUnion} nUnion  @returns {}*/
    visitNUnion(nUnion) {
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
        let res = new tipoTokenaizer();
        let nodosTipo= nProducciones.opciones.accept(this);
        nodosTipo.forEach(element => {
            res.str +=element.escribir();
        });
        return [res];
    }
    
    /**  @param {nIdentificador} nIdentificador  @returns {}*/
    visitNIdentificador(nIdentificador) {
        if (nIdentificador.nodoId != null)
            return nIdentificador.nodoId.accept(this);
        else
            return null;
    }

    /**  @param {nExpresion} nExpresion  @returns {}*/
    visitNExpresion(nExpresion) {
        debugger;
        if(nExpresion.veces!=null){
            let  cuantificador=new tipoCuantificador();
            cuantificador.setTipo(nExpresion.exp.accept(this), nExpresion.veces);
            return cuantificador;
        }

        return nExpresion.exp.accept(this);
    }

    /**  @param {nPunto} nPunto  @returns {}*/
    visitNPunto(nPunto) {
        let punto = new tipoPunto();
        punto.setI(nPunto.negacion);
        return punto;
    }
}