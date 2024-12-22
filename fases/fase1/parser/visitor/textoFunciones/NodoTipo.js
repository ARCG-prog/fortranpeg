
export class  NodoTipo {
    constructor() {
        /** @type {string} */this.str = "";
        
    }
    escribir(){
        throw new Error("Método 'escribir' debe ser implementado.");
    }
}

export class tipoLiteral extends NodoTipo {
    constructor(){
        super();
        /** @type {boolean} */this.i=false;
        /** @type {string} */this.strCursor = "cursor";
        /** @type {string} */this.strCondicion = `
            allocate( character(len=${this.str.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${this.str.length - 1})
            cursor = cursor + ${this.str.length}
            return
        `;
    }
    setAll(str,i){
        this.str = str;
        this.i = i;
    }

    /** @param {string} strCursor @param {string} strCondicion*/
    setStrs(strCursor,strCondicion){
        this.strCursor = strCursor;
        this.strCondicion = strCondicion;
    }
    escribir() {
        debugger;
        let op="";
        if(this.i)
            op = `if ("${this.str.toLowerCase()}" == to_lowercase(input(${this.strCursor}:${this.strCursor} + ${this.str.length - 1}))) then`;
        else
            op = `if ("${this.str}" == input(${this.strCursor}:${this.strCursor} + ${this.str.length - 1})) then`;
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
        this.i=false;
    }
    escribir() {
        let op = this.i ? `if(findloc(["a","b","c"],to_lowercase(input(cursor:cursor)),1)>0) then` : `if(findloc(["a","b","c"],input(cursor:cursor),1)>0) then`;
        //if(findloc(["a","b","c"],input(cursor:cursor),1)>0) then
        return `
        ${op}
            lexeme=input(cursor:cursor)
            cursor = cursor + 1
            return
        end if
        `
    }
}

export class tipoPunto extends NodoTipo {
    constructor(){
        super();
        /** @type {boolean} */this.negacion=false;
    }
    /** @param {boolean} neg */
    setI(neg){
        this.negacion = neg;
    }
    escribir() {
        let op="";
        if(this.negacion)
            op = `
            allocate( character(len=5) :: lexeme )
            lexeme= "ERROR"
            print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
            `
        else
            op = `
            allocate( character(len=1) :: lexeme )
            lexeme= input(cursor:cursor)
            cursor = cursor + 1
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
        /** @type {tipoLiteral|null} */this.nodo=null;
        /** @type {string} */this.tipo="";
        this.strExtraMas="";
    }
    /** @param {tipoLiteral} nodo @param {string} tipo*/
    setTipo(nodo,tipo){
        this.nodo = nodo;
        this.tipo = tipo;
    }
    escribir() {
        debugger;
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
        `;
    }
}

export class tipoTokenaizer extends NodoTipo {
    constructor(){
        super();
    }
    escribir() {
        return `
module tokenizer
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

    function nextSym(input, cursor) result(lexeme)
        character(len=*), intent(in) :: input
        integer, intent(inout) :: cursor
        character(len=:), allocatable :: lexeme
        !analisis *,+
        integer :: vecesAnalizado
        logical:: analizar
        analizar = .true.
        vecesAnalizado = 0
        !fin analisis *,+

        if (cursor > len(input)) then
            allocate( character(len=3) :: lexeme )
            lexeme = "EOF"
            return
        end if
        ${this.str}
        print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
        lexeme = "ERROR"
    end function nextSym
end module tokenizer
  `;
    }
}


export default { NodoTipo, tipoLiteral, tipoPatron, tipoPunto,tipoCuantificador,tipoTokenaizer};