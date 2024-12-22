
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

    function rango(strCaracteres,strRangos,charComparacion) result(match)
        character(len=*), intent(in) :: strCaracteres
        character(len=*), intent(in) :: strRangos
        character(len=1), intent(in) :: charComparacion
        logical :: match
        integer :: i
        
        do i=1, len(strCaracteres)
            if (charComparacion == strCaracteres(i:i)) then
                match = .true.
                return
            end if
        end do
        do i=1, len(strRangos), 2
            if (charComparacion >= strRangos(i:i) .and. charComparacion <= strRangos(i+1:i+1)) then
                match = .true.
                return
            end if
        end do
        match = .false.
    end function rango

    function nextSym(input, cursor) result(lexeme)
        character(len=*), intent(in) :: input
        integer, intent(inout) :: cursor
        character(len=:), allocatable :: lexeme
        !analisis *,+
        integer :: vecesAnalizado,estado
        logical:: analizar
        analizar = .true.
        vecesAnalizado = 0
        !fin analisis *,+
        !analsis rango
        estado=0
        !fin analisis rango

        if (cursor > len(input)) then
            allocate( character(len=3) :: lexeme )
            lexeme = "EOF"
            return
        end if
        
        
        estado=2 !todas las concatenaciones con 1=[abc0-23-4]+ 2=[5-6]*
        vecesAnalizado = cursor
        do while (analizar)
            ![abc0-23-4]+
            if (estado==-99) then
            else if (estado==2) then
                if (rango("abc","0234",input(vecesAnalizado:vecesAnalizado))) then
                    vecesAnalizado=vecesAnalizado+1
                else if(vecesAnalizado==cursor) then
                    analizar = .false.
                    print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
                    allocate( character(len=5) :: lexeme)
                    lexeme = "ERROR"
                    return
                else
                    !analizar = .false.
                    !allocate( character(len=2) :: lexeme)!falta tam bueno
                    !lexeme = input(cursor:vecesAnalizado-1)
                    !cursor = vecesAnalizado
                    !vecesAnalizado=0
                    !return
                    estado=estado-1
                end if

            !analisis de [5-6]*
            else if (estado==1) then
                if (rango("","56",input(vecesAnalizado:vecesAnalizado))) then
                    vecesAnalizado=vecesAnalizado+1
                else if(vecesAnalizado==cursor) then
                    !analizar = .false.
                    estado=estado-1
                else
                    !analizar = .false.
                    !allocate( character(len=3) :: lexeme)
                    !lexeme = input(cursor:vecesAnalizado-1)
                    !cursor = vecesAnalizado
                    !vecesAnalizado=0
                    !return
                    estado=estado-1
                end if

            !estado final
            else if(estado==0) then
                analizar = .false.
                lexeme = input(cursor:vecesAnalizado-1)
                cursor = vecesAnalizado
                vecesAnalizado=0
                return
            end if
        end do
        analizar=.true.
      
        print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
        lexeme = "ERROR"
    end function nextSym
end module tokenizer
  
  
  

program parser
    use tokenizer
    implicit none

    character(len=*), parameter :: input = "abc12345"
    character(len=:), allocatable :: lexeme
    integer :: cursor

    cursor = 1
    do while (lexeme /= "EOF" .and. lexeme /= "ERROR")
        lexeme = nextSym(input, cursor)
        print *, lexeme
    end do
end program parser