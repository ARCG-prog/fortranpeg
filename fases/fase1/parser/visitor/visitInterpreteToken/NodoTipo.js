
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
        let op = this.i ? `if ("${this.str.toLowerCase()}" == to_lowercase(input(cursor:cursor + ${this.str.length - 1}))) then` : ` if ("${this.str}" == input(cursor:cursor + ${this.str.length - 1})) then`;
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

export default{NodoTipo,tipoLiteral,tipoTokenaizer};