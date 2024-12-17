module fortranModule
    implicit none
    private
    public :: principal
    public :: impChar

    contains
        subroutine principal(tam, txt)
            integer, intent(in) :: tam
            character(len=:), allocatable, target, intent(inout) :: txt
            integer :: i

            ! Imprimir cada carácter usando el puntero
            do i = 1, tam
                call impChar(txt(i:i))
            end do
            
        end subroutine principal

        subroutine impChar(char)
            character(len=1), intent(in) :: char
            print *, char
        end subroutine impChar

end module fortranModule

program main
    use fortranModule
    implicit none
    character(len=:), allocatable, target :: txt
    integer :: tam

    ! Definir el tamaño de la cadena
    tam = len("Hola mundo")
    allocate(character(len=tam) :: txt)
    txt = "Hola mundo"

    ! Llamar a la subrutina principal con los parámetros
    call principal(tam, txt)

    ! Liberar la memoria
    deallocate(txt)
end program main
