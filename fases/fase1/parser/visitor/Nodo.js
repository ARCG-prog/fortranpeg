

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
export class nProducciones extends Nodo {
    constructor(id,alias,opciones) {
        super();
        this.id = id;
        this.alias = alias;
        this.opciones = opciones;
    }
    accept(visitor) {
        return visitor.visitNProducciones(this);
    }
}

export class nIdentificador extends Nodo {
    constructor(id) {
        super();
        this.id = id;
        this.nodoId=null;
    }
    setNodoId(nodoId){
        this.nodoId=nodoId;
    }
    accept(visitor) {
        return visitor.visitNIdentificador(this);
    }
}

export class nExpresion extends Nodo {
    /**  @param {string} id  @param {Nodo} exp  @param {string} veces */
    constructor(id,exp,veces) {
        super();
        /** @type {string}*/this.id = id;
        /** @type {Nodo}*/this.exp = exp;
        /** @type {string}*/this.veces = veces;
    }
    accept(visitor) {
        return visitor.visitNExpresion(this);
    }
}

export class nPunto extends Nodo {
    constructor(negacion) {
        super();
        this.negacion = negacion;
    }
    setNegacion(negacion){
        this.negacion = negacion;
    }
    accept(visitor) {
        return visitor.visitNPunto(this);
    }
}

//se debe exportar todos los nodos
export default { NodoU, NodoD,
    nLiterales, nUnion, nProducciones, nIdentificador, nExpresion, nOpciones,nPunto
};
