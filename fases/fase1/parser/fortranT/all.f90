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
        
		!analisis de 1234567 *
        vecesAnalizado=cursor
        do while (analizar)
            
        !analisis de 1234567
			if ("1234567" == input(vecesAnalizado:vecesAnalizado + 6)) then
                vecesAnalizado=vecesAnalizado+7!length(1234567)
            else if(vecesAnalizado==cursor) then
                analizar = .false.
                
            else
                analizar = .false.
                allocate( character(len=7) :: lexeme)
                lexeme = input(cursor:vecesAnalizado-1)
                cursor = vecesAnalizado
                vecesAnalizado=0
                return
        
        end if
      
        end do
        analizar = .true.
        
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
  

  

  

  


program test
	use parser
	implicit none
	character(len=100) :: filename
	character(len=:), allocatable :: input
	integer :: u, len
	logical :: exists
    
    !gfortran fortran.f90 -o hello.exe
    !./hello.exe fortran.f90


	! if (command_argument_count() == 0) then
	! 	print *, "error: no input file"
	! 	stop
	! end if

	! call get_command_argument(1, filename)

	! inquire(file=filename, exist=exists, size=len)
	! if (exists) then
	! 	open (1, file=filename, status='old', action='read', access='stream', form='unformatted')
	! 	allocate (character(len=len) :: input)
    !     read (1) input
	! 	call parse(input)
       call parse("12345671234567")
	! else
	! 	print *, "error: file is not present"
	! 	stop
	! end if

	! close(u)

end program test


