
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
    visitNOpciones(nOpciones) { // Corregido aquí
        throw new Error("Método 'visitNOpciones' debe ser implementado.");
    }
}

