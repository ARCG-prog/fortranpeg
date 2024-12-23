
import { parseRegex, generateAutomata, optimizeAutomaton, minimizeDFA, generateFortranCode } from '../../Automata/ST_Automata-V5.js';
//es un estilo de patron decorador, no es tan exacto pero funciona similar
/**
 * @fileoverview Clase NodoTipo que es la clase padre de los tipos de nodosTipo que permiten escribir en lenguaje Fortran
 */
export class  NodoTipo {
    constructor() {
        /** @type {string} */this.str = "";
        
    }
    /** @returns {string} */
    escribir(){
        throw new Error("Método 'escribir' debe ser implementado.");
    }
}


/** @fileoverview Clase tipoLiteral que hereda de NodoTipo y permite escribir en lenguaje Fortran, la lógica para analizar un literal "cadena"*/
export class tipoLiteral extends NodoTipo {
    constructor(){
        super();
        this.i=false;
        this.strCursor = "cursor";
        this.strCondicion = `
            allocate( character(len=${this.str.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${this.str.length})
            cursor = cursor + ${this.str.length}
            return
        `;
    }
    /** @param {string} str @param {boolean} i*/
    setAll(str,i){
        this.str = str;
        this.i = i;
    }
    /**  @param {string} str */
    setStr(str){
        this.str = str;
    }
    /** @param {boolean} i */
    setI(i){
        this.i = i;
    }

    /** @param {string} strCursor @param {string} strCondicion*/
    setStrs(strCursor,strCondicion){
        this.strCursor = strCursor;
        this.strCondicion = strCondicion;
    }
    escribir() {
        let op="";
        if(this.i)
            op = `if ("${this.str.toLowerCase()}" == to_lowercase(input(${this.strCursor}:${this.strCursor} + ${this.str.length}))) then`;
        else
            op = `if ("${this.str}" == input(${this.strCursor}:${this.strCursor} + ${this.str.length})) then`;
        return `
        !analisis de ${this.str}
        ${op + this.strCondicion}
        end if
      `
    }
}
export class tipoPatron extends NodoTipo {
    constructor(){
        super();
    }
    setStr(str){
        this.str = str;
    }
    /** @param {string} str @param {boolean} i*/
    escribir() {
        debugger;
        const syntaxTree = parseRegex(this.str); // arbol de sintaxis
        const automaton = generateAutomata(syntaxTree); // thompson
        const optimizedAutomaton = optimizeAutomaton(automaton); // subconjuntos
        const minimizedDFA = minimizeDFA(optimizedAutomaton); // minimizacion
        const codigoFortran = generateFortranCode(minimizedDFA)
        return codigoFortran;
    }
}
export class tipoPunto extends NodoTipo {
    constructor(){
        super();
        this.negacion=false;
        this.strAsigMemoria = "1";
        this.strCursor = "cursor";
        this.strSumaCursor = "cursor + 1";
    }
    /** @param {boolean} neg */
    setI(neg){
        this.negacion = neg;
    }
    /** @param {string} strAsigMemoria @param {string} strCursor @param {string} strSumaCursor*/
    setStrs(strAsigMemoria,strCursor,strSumaCursor){
        this.strAsigMemoria = strAsigMemoria;
        this.strCursor = strCursor;
        this.strSumaCursor = strSumaCursor;
    }
    escribir() {
        let op="";
        if(this.negacion)
            op = `
            !analisis de !.
            allocate( character(len=5) :: lexeme )
            lexeme= "ERROR"
            print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
            `
        else
            op = `
            !analisis de .
            allocate( character(len=${this.strAsigMemoria}) :: lexeme )
            lexeme= input(cursor:${this.strCursor})
            cursor = ${this.strSumaCursor}
            `
        return `
        if(cursor<=len(input)) then
            ${op}
            return
        end if
      `
    }
}
export class tipoCuantificador extends NodoTipo {
    constructor(){
        super();
        /** @type {NodoTipo|null} */this.nodo=null;
        this.tipo="";
    }
    /** @param {NodoTipo} nodo @param {string} tipo*/
    setTipo(nodo,tipo){
        this.nodo = nodo;
        this.tipo = tipo;
    }
    escribir() {
        throw new Error("Método 'escribir' debe ser implementado.");
    }
}
export class tipoI extends NodoTipo {
    constructor(){
        super();
        /** @type {tipoLiteral|null} */
        this.nodo=null;
    }

    /** @param {tipoLiteral} nodo */
    setNodo(nodo){
        this.nodo = nodo;
    }

    escribir() {
        this.nodo.setI(true);
        return this.nodo.escribir();
    }
}

export class tipoOpcionOR extends NodoTipo {
    constructor(){
        super();
        /** @type {NodoTipo|null} */
        this.nodo=null;
    }
    /** @param {NodoTipo} nodo */
    setNodo(nodo){
        this.nodo = nodo;
    }
    escribir() {
        return this.nodo.escribir();
    }
}

export class tipoCuantificadorLiteral extends tipoCuantificador {
    constructor(){
        super();
        this.strExtraMas="";
    }
    /** @param {NodoTipo} nodo @param {string} tipo*/
    setTipo(nodo,tipo){
        super.setTipo(nodo,tipo);
    }
    escribir() {
        if(this.tipo == "*") //*
            this.strExtraMas = ""
        else if(this.tipo == "+") //+
            this.strExtraMas = `
                print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
                allocate( character(len=5) :: lexeme)
                lexeme = "ERROR"
                return
            `
        else // ?
            return this.nodo.escribir();

        this.nodo.setStrs(
        "vecesAnalizado",
        `
                vecesAnalizado=vecesAnalizado+${this.nodo.str.length}!length(${this.nodo.str})
            else if(vecesAnalizado==cursor) then
                analizar = .false.
                ${this.strExtraMas}
            else
                analizar = .false.
                allocate( character(len=${this.nodo.str.length}) :: lexeme)
                lexeme = input(cursor:vecesAnalizado-1)
                cursor = vecesAnalizado
                vecesAnalizado=0
                return
        `);
        return `
		!analisis de ${this.nodo.str} ${this.tipo}
        vecesAnalizado=cursor
        do while (analizar)
            ${this.nodo.escribir()}
        end do
        analizar = .true.
        `;
    }
}
export class tipoCuantificadorPunto extends tipoCuantificador {
    constructor(){
        super();
    }
    /** @param {NodoTipo} nodo @param {string} tipo*/
    setTipo(nodo,tipo){
        super.setTipo(nodo,tipo);
    }
    escribir() {
        if(this.tipo=="*" || this.tipo=="+"){
            this.nodo.setStrs(
                `len(input)-cursor+1`,
                `len(input)`,
                `len(input)+1 !analisis *,+`
            );
        }
        return this.nodo.escribir();
    }
}



export class tipoFusion extends NodoTipo {
    constructor(){
        super();
        this.str="";
    }
    escribir() {
        return this.str;
    }
}
export class tipoTokenaizer extends NodoTipo {
    constructor(){
        super();
        /** @type {NodoTipo|null} */this.nodo=null;
    }
    /** @param {NodoTipo} nodo */
    setNodo(nodo){
        this.nodo = nodo;
    }

    escribir() {
        return `
module parser
    implicit none
    contains
    function to_lowercase(str)
        character(len=*), intent(in) :: str
        character(len=len(str)) :: to_lowercase
        integer :: i
        do i = 1, len(str)
            if (iachar(str(i:i)) >= iachar('A') .and. iachar(str(i:i)) <= iachar('Z')) then
                to_lowercase(i:i) = achar(iachar(str(i:i)) + 32)
            else
                to_lowercase(i:i) = str(i:i)
            end if
        end do
    end function to_lowercase

    function lexemas(input, cursor) result(lexeme)
        !analisis de lexemas
        character(len=*), intent(in) :: input
        integer, intent(inout) :: cursor
        character(len=:), allocatable :: lexeme
        !analisis de lexemas

        !analisis extras
        integer :: vecesAnalizado, currentState
        logical:: analizar, isAccepted, continueLoop
        analizar = .true.
        vecesAnalizado = 0
        !fin analisis extras



        if (cursor > len(input)) then
            allocate( character(len=3) :: lexeme )
            lexeme = "EOF"
            return
        end if
        ${this.nodo.escribir()}
        print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
        lexeme = "ERROR"
    end function lexemas

    subroutine parse(input)
        implicit none
        character(len=*), intent(in) :: input
        character(len=:), allocatable :: lexeme
        integer :: cursor

        cursor = 1
        do while (lexeme /= "EOF" .and. lexeme /= "ERROR")
            lexeme = lexemas(input, cursor)
            print *, lexeme
        end do
    end subroutine parse


end module parser

  `;
    }
}



export default { NodoTipo, 
    tipoLiteral, tipoPatron, tipoPunto, 
    tipoCuantificador, tipoCuantificadorLiteral, tipoCuantificadorPunto, 
     tipoTokenaizer, 
    tipoFusion, tipoOpcionOR };

