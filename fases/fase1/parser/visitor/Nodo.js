
export class Nodo {
    constructor() {
    }
    accept(visitor) {
        throw new Error("Método 'accept' debe ser implementado.");
    }
}

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

//se debe exportar todos los nodos
export default {NodoU, NodoD};