import { NodoL } from "./NodoL.js";
import { estadosFortran, moduloEstadosFortran, moduloFuncionesRetornoFortran, unionFortranFinal } from "../visitor/textoFunciones/funcFortran.js";
import { config } from "../varGlobales/global.js";
export class Lista {
    constructor() {
        this.primero = null;
        this.ultimo = null;
    }
    /** * * @param {NodoL} nuevo */
    addUltimo(nuevo) {
        if (this.primero == null) {
            this.primero = nuevo;
            this.ultimo = nuevo;
        }
        else {
            this.ultimo.siguiente = nuevo;
            nuevo.anterior = this.ultimo;
            this.ultimo = nuevo;
        }
    }
    /** @param {Lista} listaInicio @param {Lista} listaFinal*/
    unirListaInicioFinal(listaInicio,listaFinal) {
        //como paso al siguiente
        listaInicio.ultimo.siguiente = listaFinal.primero;
        //como paso al anterior
        listaFinal.primero.anterior = listaInicio.ultimo;
        //cambiando el ultimo
        listaInicio.ultimo = listaFinal.ultimo;
        //cambiando el estado ultimo
        listaInicio.ultimo.estado = listaInicio.primero.estado+1;
        //hacer la lista anterior nula
        listaFinal.primero = null;
        listaFinal.ultimo = null;
    }

    /** @param {NodoL} nodoActual @param {string} error @param {string} aceptacion*/
    modificarSaltoFortran(nodoActual,error,aceptacion){
        nodoActual.codigoError = error;
        nodoActual.codigoAceptado = aceptacion;
    }

    generarTodoElCodigo(){
        debugger;
        let aux = this.primero;
        let estados = "";
        let funciones = "";
        while (aux != null) {
            estados += estadosFortran(aux.estado, aux.alias, aux.codigoFuncion, aux.codigoError, aux.codigoAceptado);
            aux = aux.siguiente;
        }
        estados=moduloEstadosFortran(estados);
        let iterator=config.variables.gFuncionesCreadas.values();
        let resultado=iterator.next();
        while(!resultado.done){
            funciones+=resultado.value;
            resultado=iterator.next();
        }
        funciones=moduloFuncionesRetornoFortran(funciones);
        return unionFortranFinal(estados, funciones);
    }

    getLista() {
        let lista = [];
        let aux = this.primero;
        while (aux != null) {
            lista.push(aux);
            aux = aux.siguiente;
        }
        return lista;
    }
}