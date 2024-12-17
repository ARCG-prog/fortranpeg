import { Visitor } from "./visitor/Visitor.js";
export default class InterpreteToken extends Visitor {
    //codigo solo para pruebas
    visitNodoU(nodo) {
        return `${nodo.a.accept(this)} ${nodo.str} ${nodo.b.accept(this)}`;
    }
    visitNodoD(nodo) {
        return `<DOS> ${nodo.str}`;
    }

    //codigo que si se utilizara
    visitnComentario(nComentario) {
        return `<COMENTARIO> ${nComentario.str}`;
    }
}