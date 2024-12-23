
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
        
        
        currentState = 2
        isAccepted = .false.
        continueLoop = .true.  ! Inicializamos la variable de control

        do vecesAnalizado=cursor, len_trim(input)
            !do vecesAnalizado = 1, len_trim(input)
            if (.not. continueLoop) exit  ! Salir del ciclo si continueLoop es falso

            select case(currentState)

                case (0)
               
                    if (input(vecesAnalizado:vecesAnalizado) == 'c') then
                        currentState = 0
                        isAccepted = .true.
                            
                    else if (input(vecesAnalizado:vecesAnalizado) == 'd') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '0') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '1') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '2') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '3') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '4') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '5') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == 'h') then
                        currentState = 1
                        isAccepted = .true.
            
                    else if (input(vecesAnalizado:vecesAnalizado) == 'i') then 
                        currentState = 1
                        isAccepted = .true.
                    else
                        isAccepted = .false.
                        continueLoop = .false.  ! Cambiamos la variable de control
                    end if
                    
                    if ( (vecesAnalizado) == len_trim(input)) then
                        isAccepted = .true.
                        continueLoop = .false.
                    else
                        isAccepted = .false.
                    end if
        
                case (1)
        
                    if ( vecesAnalizado  - 1 < len_trim(input)) then
                        isAccepted = .false.
                        continueLoop = .false.
                    else
                        isAccepted = .true.
                    end if
        
                case (2)
               
                    if (input(vecesAnalizado:vecesAnalizado) == 'a') then
                        currentState = 2
                        isAccepted = .true.
                            
                    else if (input(vecesAnalizado:vecesAnalizado) == 'k') then
                        currentState = 2
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == 'c') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == 'd') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '0') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '1') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '2') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '3') then
                        currentState = 0
                        isAccepted = .true.
                    
                    else if (input(vecesAnalizado:vecesAnalizado) == '4') then
                        currentState = 0
                        isAccepted = .true.
            
                    else if (input(vecesAnalizado:vecesAnalizado) == '5') then 
                        currentState = 0
                        isAccepted = .true.
                    else
                        isAccepted = .false.
                        continueLoop = .false.  ! Cambiamos la variable de control
                    end if
                    
            case default
                print *, 'Error: Invalid state or transition.'
                continueLoop = .false.  ! Cambiamos la variable de control
            end select
        end do

        if (isAccepted) then
            !print *, 'The string is accepted.'
            lexeme=input(cursor:vecesAnalizado)
            cursor = vecesAnalizado
            vecesAnalizado = 0
            return
        else
            !print *, 'The string is rejected.'
            vecesAnalizado = 0
        end if

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
       call parse("ff")
	! else
	! 	print *, "error: file is not present"
	! 	stop
	! end if

	! close(u)

end program test


