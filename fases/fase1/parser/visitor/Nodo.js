
export class Nodo {
    constructor() {
    }
    accept(visitor) {
        throw new Error("Método 'accept' debe ser implementado.");
    }
}

//nodos solo para pruebas
export class NodoU extends Nodo {
    constructor(a,b,str) {
        super();
        this.a = a;
        this.b = b;
        this.str = str;
    }
    accept(visitor) {
        return visitor.visitNodoU(this);
    }
}
export class NodoD extends Nodo {
    constructor(str) {
        super();
        this.str = str;
    }
    accept(visitor) {
        return visitor.visitNodoD(this);
    }
}

//nodo que si es para el codigo
export class nComentario extends Nodo{
    constructor(str){
        super();
        this.str = str;
    }
    accept(visitor){
        return visitor.visitnComentario(this);
    }
}

//se debe exportar todos los nodos
export default {NodoU, NodoD};
