
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

    visitnLiterales(nLiterales){
        throw new Error("Método 'visitnLiterales' debe ser implementado.");
    }
    
    visitnIdentificador(nIdentificador){
        throw new Error("Método 'visitnIdentificador' debe ser implementado.");
    }

    visitnProducciones(nProducciones){
        throw new Error("Método 'visitnProducciones' debe ser implementado.");
    }

    visitnIgual(nIgual){
        throw new Error("Método 'visitnIgual' debe ser implementado.");
    }

    /**@param {Nodo} nGramatica */
    visitnGramatica(nGramatica){
        throw new Error("Método 'visitnGramatica' debe ser implementado.");
    }
}
