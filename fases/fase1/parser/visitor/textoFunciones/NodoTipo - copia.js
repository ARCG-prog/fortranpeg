
export class  NodoTipo {
    constructor() {
        this.str = "";
    }
    escribir(){
        throw new Error("Método 'escribir' debe ser implementado.");
    }
}

export class tipoLiteral extends NodoTipo {
    constructor(){
        super();
        this.i=false;
    }
    setAll(str,i){
        this.str = str;
        this.i = i;
    }

    escribir() {
        let op = "" //this.i ? `if ("${this.str.toLowerCase()}" == to_lowercase(input(cursor:cursor + ${this.str.length - 1}))) then` : `if ("${this.str}" == input(cursor:cursor + ${this.str.length - 1})) then`;
        let tipoCursor ="cursor";
        if(this.i)
            op = `if ("${this.str.toLowerCase()}" == to_lowercase(input(cursor:cursor + ${this.str.length - 1}))) then`;
        else
            op = `if ("${this.str}" == input(cursor:cursor + ${this.str.length - 1})) then`;


        return `
        !analisis de ${this.str}
        ${op}
            allocate( character(len=${this.str.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${this.str.length - 1})
            cursor = cursor + ${this.str.length}
            return
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
        this.negacion=false;
    }
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
        this.tipo=null;
    }
    /** @param {NodoTipo} tipo */
    setTipo(tipo){
        this.tipo = tipo;
    }
    escribir() { 
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

    function lexemas(input, cursor) result(lexeme)
        character(len=*), intent(in) :: input
        integer, intent(inout) :: cursor
        character(len=:), allocatable :: lexeme
        
        if (cursor > len(input)) then
            allocate( character(len=3) :: lexeme )
            lexeme = "EOF"
            return
        end if
        ${this.str}
        print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
        lexeme = "ERROR"
    end function lexemas
end module tokenizer
  `;
    }
}


export default{NodoTipo,tipoLiteral,tipoTokenaizer};