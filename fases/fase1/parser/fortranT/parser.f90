

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
        
		!analisis de aBc *
        vecesAnalizado=cursor
        do while (analizar) 
        !analisis de aBc
            if (vecesAnalizado<=len(input)) then
                vecesAnalizado=vecesAnalizado+1!length(aBc)
            else if(vecesAnalizado==cursor) then
                analizar = .false.
            else
                analizar = .false.
                allocate( character(len=1) :: lexeme)
                lexeme = input(cursor:vecesAnalizado)
                cursor = vecesAnalizado
                vecesAnalizado=0
                return
            end if
        end do
        
        print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
        lexeme = "ERROR"
    end function nextSym
end module tokenizer
  
  

program parser
    use tokenizer
    implicit none

    character(len=*), parameter :: input = "abCaBCxd"
    character(len=:), allocatable :: lexeme
    integer :: cursor

    cursor = 1
    do while (lexeme /= "EOF" .and. lexeme /= "ERROR")
        lexeme = nextSym(input, cursor)
        print *, lexeme
    end do
end program parser