program main
    implicit none
    character(len=:), allocatable, target :: txt
    character(len=1), pointer :: char_ptr
    integer :: tam, i

    ! Definir el tamaño de la cadena
    tam = len("Hola mundo")
    allocate(character(len=tam) :: txt)
    txt = "Hola mundo"

    ! Asignar el puntero al primer carácter de la cadena
    char_ptr => txt(1:1)

    ! Imprimir cada carácter usando el puntero
    do i = 1, tam
        print *, char_ptr
        if (i < tam) char_ptr => txt(i+1:i+1)
    end do

    ! Liberar la memoria
    deallocate(txt)
end program main
