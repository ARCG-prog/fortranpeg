
export class Visitor {
    // Código solo para pruebas
    visitNodoU(NodoU) {
        throw new Error("Método 'visitNodoU' debe ser implementado.");
    }
    visitNodoD(NodoD) {
        throw new Error("Método 'visitNodoD' debe ser implementado.");
    }

    // Código que sí se utilizará
    visitNLiterales(nLiterales) {
        throw new Error("Método 'visitNLiterales' debe ser implementado.");
    }
    visitNUnion(nUnion) {
        throw new Error("Método 'visitNUnion' debe ser implementado.");
    }
    visitNOpciones(nOpciones) {
        throw new Error("Método 'visitNOpciones' debe ser implementado.");
    }
    visitNProducciones(nProducciones) {
        throw new Error("Método 'visitNProducciones' debe ser implementado.");
    }
    visitNIdentificador(nIdentificador) {
        throw new Error("Método 'visitNIdentificador' debe ser implementado.");
    }
    visitNExpresion(nExpresion) {
        throw new Error("Método 'visitNExpresion' debe ser implementado.");
    }
    visitNPunto(nProduccion) {
        throw new Error("Método 'visitNPunto' debe ser implementado.");
    }
    visitNRango(nRango) {
        throw new Error("Método 'visitNRango' debe ser implementado.");
    }
    visitNGramatica(nGramatica) {
        throw new Error("Método 'visitNGramatica' debe ser implementado.");
    }
}

