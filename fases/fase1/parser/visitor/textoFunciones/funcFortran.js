

/**  @param {string} str  @returns {string}*/
export function analizarLiterales(str) {
  return `
        !analisis de ${str}
        if ("${str}" == input(cursor:cursor + ${str.length-1})) then
            allocate( character(len=${str.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${str.length-1})
            cursor = cursor + ${str.length}
            return
        end if
      `;
}
/**  @param {string} str  @returns {string}*/
export function analizarLiteralesLower(str) {
  return `
        !analisis de ${str}
        if ("${str.toLowerCase()}" == to_lowercase(input(cursor:cursor + ${str.length - 1}))) then
            allocate( character(len=${str.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${str.length - 1})
            cursor = cursor + ${str.length}
            return
        end if
  `;
}


/** @param {string} str @returns {string}*/
export function tokenizer(str){
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
        ${str}
        print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
        lexeme = "ERROR"
    end function nextSym
end module tokenizer
  `;
}

export default { analizarLiterales, tokenizer };