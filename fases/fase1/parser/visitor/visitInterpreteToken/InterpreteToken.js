import { Visitor } from "./Visitor.js";
import { analizarLiterales,analizarLiteralesLower } from "../textoFunciones/funcFortran.js";
import { nLiterales, nUnion, nOpciones, nPunto, nExpresion, nIdentificador } from "../Nodo.js";
import { tipoLiteral, NodoTipo, tipoConcatenacion, tipoPunto, tipoCuantificador, tipoCuantificadorPunto, tipoCuantificadorLiteral} from "../textoFunciones/NodoTipo.js";


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
    /**  @param {nLiterales} nLiterales*/
    visitNLiterales(nLiterales) {
        let literal = new tipoLiteral();
        literal.setAll(nLiterales.str, nLiterales.i);
        return literal;
    }

    /**  @param {nUnion} nUnion*/
    visitNUnion(nUnion) {
        const resultado = [].concat(...nUnion.exp.map(element => element.accept(this)));
        return resultado;
    }

    /**  @param {nOpciones} nOpciones*/
    visitNOpciones(nOpciones){
        const resultado = [].concat(...nOpciones.union.map(element => element.accept(this)));
        return resultado;
    }

    /**  @param {nProducciones} nProducciones*/
    visitNProducciones(nProducciones) {
        let res = new tipoConcatenacion();
        let nodosTipo= nProducciones.opciones.accept(this);
        nodosTipo.forEach(element => {
            res.str +=element.escribir();
        });
        return [res];
    }
    
    /**  @param {nIdentificador} nIdentificador*/
    visitNIdentificador(nIdentificador) {
        if (nIdentificador.nodoId != null)
            return nIdentificador.nodoId.accept(this);
        else
            return null;
    }

    /**  @param {nExpresion} nExpresion*/
    visitNExpresion(nExpresion) {
        if(nExpresion.veces!=null){//si viene un cuantificador
            /** @type {tipoCuantificador|null}*/
            debugger;
            let cuantificador = null;
            if(nExpresion.exp instanceof nLiterales)
                cuantificador = new tipoCuantificadorLiteral();
            else if(nExpresion.exp instanceof nPunto)
                cuantificador = new tipoCuantificadorPunto();
            //BUG: falta un else
            cuantificador.setTipo(nExpresion.exp.accept(this), nExpresion.veces);
            return cuantificador;
        }

        return nExpresion.exp.accept(this);
    }

    /**  @param {nPunto} nPunto*/
    visitNPunto(nPunto) {
        let punto = new tipoPunto();
        punto.setI(nPunto.negacion);
        return punto;
    }
}