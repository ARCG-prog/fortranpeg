import { Visitor } from "./Visitor.js";
import { config } from "../../varGlobales/global.js";
import { analizarLiterales, analizarIdentificador } from "../textoFunciones/funcFortran.js";
import { NodoL } from "../../Lista/NodoL.js";
import { Lista } from "../../Lista/Lista.js";

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

    visitnProducciones(nProducciones) {
        let nodoL= new NodoL();
        //let lista = new Lista();
        /** @type {Lista}*/let listaId= nProducciones.id.accept(this);
        /** @type {Lista}*/let listaOp= nProducciones.op.accept(this);
        
        //como paso al siguiente
        listaId.ultimo.siguiente = listaOp.primero;

        //como paso al anterior
        listaOp.primero.anterior = listaId.ultimo;

        //cambiando el ultimo
        listaId.ultimo = listaOp.ultimo;

        //cambiando el estado ultimo
        listaId.ultimo.estado = listaId.primero.estado+1;

        //hacer la lista anterior nula
        listaOp.primero = null;
        listaOp.ultimo = null;
        
        return listaId;
    }

    visitnIgual(nIgual) {
        return new Lista();
    }

    visitnGramatica(nGramatica) {
        for (const nodo of nGramatica.producciones) {
            nodo.accept(this);
        }
        return new Lista();
    }
}