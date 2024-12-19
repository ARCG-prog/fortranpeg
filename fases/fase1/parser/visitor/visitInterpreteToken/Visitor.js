export class Visitor{
    //codigo solo para pruebas
    visitNodoU(NodoU){
        throw new Error("Método 'visitNodoU' debe ser implementado.");
    }
    visitNodoD(NodoD){
        throw new Error("Método 'visitNodoD' debe ser implementado.");
    }

    //codigo que si se utilizara
    visitnComentario(nComentario){
        throw new Error("Método 'visitnComentario' debe ser implementado.");
    }
}
