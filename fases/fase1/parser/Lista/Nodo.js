export class Nodo {
    constructor() {

        /**@type {Nodo}*/
        this.siguiente=null;
        /**@type {Nodo}*/
        this.anterior=null;
        /**@type {string}-codigo de error fortran*/
        this.codigoError="";
        /**@type {string}-codigo de aceptacion fortran*/
        this.codigoAceptado="";
        /**@type {string}-codigo funcion de un nodo hoja principal*/
        this.codigoFuncion="";
        /**@type {number}-estado que pasa en fortran*/
        this.estado=0;
        /**@type {string}-alis pegjs para fortran*/
        this.alias="";
    }

    setCodigoError(codigoError){
        this.codigoError=codigoError;
    }

    setCodigoAceptado(codigoAceptado){
        this.codigoAceptado=codigoAceptado;
    }

    getAlias=()=> this.alias;
}
