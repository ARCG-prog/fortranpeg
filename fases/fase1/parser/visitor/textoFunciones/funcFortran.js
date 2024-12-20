

/**  @param {string} str  @returns {string}*/
export function analizarLiterales(str) {
  return `
        if ("${str}" == input(cursor:cursor + ${str.length-1})) then
            allocate( character(len=${str.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${str.length-1})
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