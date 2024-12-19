import { NodoL } from "./NodoL.js";
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