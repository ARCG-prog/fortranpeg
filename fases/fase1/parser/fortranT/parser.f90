

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
        
		! analisis de . *,+
        if(cursor<=len(input)) then
            allocate( character(len=len(input)-cursor+1) :: lexeme )
            lexeme= input(cursor:len(input))
            cursor = len(input)+1
            return
        end if		

        
        print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
        lexeme = "ERROR"
    end function nextSym
end module tokenizer
  
  

program parser
    use tokenizer
    implicit none

    character(len=*), parameter :: input = "abcjklf"
    character(len=:), allocatable :: lexeme
    integer :: cursor

    cursor = 3
    do while (lexeme /= "EOF" .and. lexeme /= "ERROR")
        lexeme = nextSym(input, cursor)
        print *, lexeme
    end do
end program parser