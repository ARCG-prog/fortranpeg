
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

    function nextSym(input) result(lexeme)
        character(len=:), intent(inout), allocatable :: input
        !integer, intent(inout) :: cursor
        character(len=:), allocatable :: lexeme
        !analisis *,+
        integer :: vecesAnalizado,cursor
        logical:: analizar
        analizar = .true.
        vecesAnalizado = 0
        !fin analisis *,+
        !agruegue
        cursor = 1
        !fin agregue
        
        if (char(0)==input(cursor:cursor)) then!agregue
            allocate( character(len=3) :: lexeme )
            lexeme = "EOF"
            input = input(cursor+1:)
            return
        end if


        !analisis de ab
		if ("ab" == input(cursor:cursor + 1)) then
            allocate( character(len=2) :: lexeme)
            lexeme = input(cursor:cursor + 1)
            cursor = cursor + 2
            input = input(cursor:)
            return
        end if

      
        print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
        lexeme = "ERROR"
        !agregue
        input = input(len(input)+1:)
        !fin agregue
        return
    end function nextSym
end module tokenizer
  
  
  

program parser
    use tokenizer
    implicit none
    character(len=:), allocatable :: input
    character(len=:), allocatable :: lexeme
    
    input="abab"//char(0)!agregue
    do while (len(input) > 0)
        lexeme = nextSym(input)
        print *, lexeme
    end do
end program parser