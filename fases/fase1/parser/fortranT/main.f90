module fortranModule
    implicit none
    private
    public :: principal

    contains

        subroutine principal(tam, txt)
            integer, intent(in) :: tam
            character(len=:), allocatable, target, intent(in) :: txt
            real :: state
            integer :: i

            state = 1.0

            ! Imprimir cada carácter usando el puntero
            do i = 1, tam-1
                state = comentarios(state, txt(i:i), txt(i+1:i+1))
            end do
        end subroutine principal

        function comentarios(state_in, cAtual, cNext) result(state)
            character(len=1), intent(in) :: cAtual, cNext
            real, intent(in) :: state_in
            real :: state ! Copia local del estado

            state = state_in

            ! posibles estados
            if (state == 1.0 .and. cNext == "*") then
                state = 2.0
            else if (state == 1.0 .and. cNext == "/") then
                state = 1.1

            ! comentario multilinea
            else if (state == 2.0 .and. cNext /= "*") then
                state = 2.0
            else if (state == 2.0 .and. cNext == "*") then
                state = 3.0
            else if (state == 3.0 .and. cNext == "/") then
                state = 4.0
            else if (state == 3.0 .and. cNext /= "/") then
                state = 2.0

            ! comentario de una linea
            else if (state == 1.1 .and. cNext /= char(10)) then
                state = 1.1
            else if (state == 1.1 .and. cNext == char(10)) then
                state = 2.1
           
            else if (state == 4.0 .or. state == 2.1) then ! aceptación
                state = 0.0
                print *, "Comentario aceptado"
                return
            else! errores
                state = -1.0
                print *, "Error en el comentario"
                return
            end if

            !print *, "Estado: ", state, " Caracter actual: ", cAtual, " Caracter siguiente: ", cNext
            return
        end function comentarios

end module fortranModule

program main
    use fortranModule
    implicit none
    character(len=:), allocatable, target :: txt
    integer :: tam

    ! Definir el tamaño de la cadena
    tam = len("/*hola*/"//char(10))!concatenar con salto de linea
    allocate(character(len=tam) :: txt)
    txt = "/*hola*/"//char(10)

    ! Llamar a la subrutina principal con los parámetros
    call principal(tam, txt)

    ! Liberar la memoria
    deallocate(txt)
end program main
