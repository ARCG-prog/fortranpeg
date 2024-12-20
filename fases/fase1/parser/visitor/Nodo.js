

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
export class nLiterales extends Nodo {
    /**  @param {string} str  @param {boolean} i */
    constructor(str,i) {
        super();
        this.str = str;
        this.i = i;
    }
    accept(visitor) {
        return visitor.visitNLiterales(this);
    }
}
export class nUnion extends Nodo {
    constructor(exp) {
        super();
        this.exp = exp;
    }
    accept(visitor) {
        return visitor.visitNUnion(this);
    }
}
export class nOpciones extends Nodo {
    constructor(union) {
        super();
        this.union = union;
    }
    accept(visitor) {
        return visitor.visitNOpciones(this);
    }
}
//se debe exportar todos los nodos
export default { NodoU, NodoD,
    nLiterales, nUnion
};
