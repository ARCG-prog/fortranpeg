
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
    constructor(){
        super();
    }
    accept(visitor){
        return visitor.visitnComentario(this);
    }
}

export class nLiterales extends Nodo{
    constructor(){
        super();
    }
    accept(visitor){
        return visitor.visitnLiterales(this);
    }
}

export class nIdentificador extends Nodo{
    constructor(){
        super();
    }
    accept(visitor){
        return visitor.visitnIdentificador(this);
    }
}

export class nProducciones extends Nodo{
    constructor(id,op){
        super();
        this.id = id;
        this.op = op;
    }
    accept(visitor){
        return visitor.visitnProducciones(this);
    }
}

export class nIgual extends Nodo{
    constructor(){
        super();
    }
    accept(visitor){
        return visitor.visitnIgual(this);
    }
}

//se debe exportar todos los nodos
export default { NodoU, NodoD, 
    nComentario, nLiterales, nIdentificador 
    ,nProducciones
};
