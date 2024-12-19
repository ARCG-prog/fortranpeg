import { Visitor } from "./Visitor.js";
import { config } from "../../varGlobales/global.js";
import { analizarLiterales, analizarIdentificador } from "../textoFunciones/funcFortran.js";

export default class InterpreteToken extends Visitor {
    constructor() {
        super();
    }
    //codigo solo para pruebas
    visitNodoU(nodo) {
        return `${nodo.a.accept(this)} ${nodo.str} ${nodo.b.accept(this)}`;
    }
    visitNodoD(nodo) {
        return `<DOS> ${nodo.str}`;
    }

    //codigo que si se utilizara
    visitnComentario(nComentario){
        return `<COMENTARIO> ${nComentario.str}`;
    }

    visitnLiterales(nLiterales) {
        
        if (!config.variables.gFuncionesCreadas.has("analizarLiterales")){
            config.variables.gFuncionesCreadas.set("analizarLiterales", analizarLiterales);
        }
        return `analizarLiterales(txt, columna)`;
    }

    visitnIdentificador(nIdentificador) {
        if (!config.variables.gFuncionesCreadas.has("analizarIdentificador")){
            config.variables.gFuncionesCreadas.set("analizarIdentificador", analizarIdentificador);
        }
        return `analizarIdentificador(txt, columna)`;
    }

    visitnProducciones(nProducciones) {
        return `${nProducciones.id.accept(this)} ${nProducciones.op.accept(this)}`;
    }
}