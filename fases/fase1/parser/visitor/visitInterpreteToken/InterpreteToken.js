import { Visitor } from "./Visitor.js";
import { nLiterales, nUnion, nOpciones, nProducciones, nIdentificador, nExpresion, nPunto, nRango } from "../Nodo.js";
import { tipoLiteral, NodoTipo, tipoFusion, tipoPunto, tipoCuantificador, 
    tipoCuantificadorPunto, tipoCuantificadorLiteral, tipoPatron, tipoI, tipoOpcionOR } from "../textoFunciones/NodoTipo.js";


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
        //literal.setAll(nLiterales.str, nLiterales.i);
        let literal = new tipoLiteral();

        /** @type {NodoTipo|null} */
        let literalaux=null;
        literal.setStr(nLiterales.str);
        if(nLiterales.i){
            literalaux = new tipoI();
            literalaux.setNodo(literal);
        }else
            literalaux = literal;

        return [literalaux];
    }
    /**  @param {nPunto} nPunto*/
    visitNPunto(nPunto) {
        let punto = new tipoPunto();
        punto.setI(nPunto.negacion);
        return [punto];
    }
    /**  @param {nRango} nRango*/
    visitNRango(nRango) {
        let patron = new tipoPatron();
        patron.setStr(nRango.str);
        return [patron];
    }

    /**  @param {nUnion} nUnion*/
    visitNUnion(nUnion) {
        const resultado = [].concat(...nUnion.exp.map(element => element.accept(this)));

        if(resultado.length==1)
            return resultado;

        for (let i = 0; i < resultado.length; i++) {//fusionar literales y patrones solo si son consecutivos y del mismo tipo ademas de ser tipo concatenacion
            if (resultado[i] instanceof tipoLiteral) {
                console.log("es un literal");
                if (i < resultado.length - 1 && resultado[i + 1] instanceof tipoLiteral) { 
                    resultado[i].str += resultado[i + 1].str;
                    resultado.splice(i + 1, 1); // Eliminar el siguiente si es del mismo tipo
                    i--; // Disminuir el contador para volver a verificar el mismo índice
                } else
                    break; // Salir del bucle si el siguiente no es del mismo tipo 
            }else if (resultado[i] instanceof tipoPatron) { 
                console.log("es un patron");
                if (i < resultado.length - 1 && resultado[i + 1] instanceof tipoPatron) {
                    resultado[i].str += resultado[i + 1].str;
                    resultado.splice(i + 1, 1); // Eliminar el siguiente si es del mismo tipo
                    i--; // Disminuir el contador para volver a verificar el mismo índice
                }else 
                    break; // Salir del bucle si el siguiente no es del mismo tipo 
            }else if(resultado[i] instanceof tipoPunto)
                console.log("es un punto");
            else
                console.log("es otro tipo");
        }
        return resultado;
        
    }
    
    /**  @param {nOpciones} nOpciones*/
    visitNOpciones(nOpciones){
        let rango= new tipoPatron();
        const resultado = [].concat(...nOpciones.union.map(element => element.accept(this)));
        //envolver en un tipoOpcionOR para no que nose una con los if e visitNUnion
        let res2=[];
        for (let i = 0; i < resultado.length; i++) {
            let opcion = new tipoOpcionOR();
            debugger;
            opcion.setNodo(resultado[i]);
            res2.push(opcion);
        }

        return resultado;
    }

    /**  @param {nProducciones} nProducciones*/
    visitNProducciones(nProducciones) {
        let res = new tipoFusion();
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
            /** @type {NodoTipo|null}*/
            let cuantificador = null;
            if(nExpresion.exp instanceof nLiterales){//si es un literal
                cuantificador = new tipoCuantificadorLiteral();
                cuantificador.setTipo(nExpresion.exp.accept(this)[0], nExpresion.veces);
            }
            else if(nExpresion.exp instanceof nPunto){//si es un punto
                cuantificador = new tipoCuantificadorPunto();
                cuantificador.setTipo(nExpresion.exp.accept(this)[0], nExpresion.veces);
            }
            else{//si es un rango
                cuantificador = nExpresion.exp.accept(this)[0];
                cuantificador.str+=nExpresion.veces;
            }
            return cuantificador;
        }

        return nExpresion.exp.accept(this);
    }


}