module global_variables
  implicit none
  integer :: globalState

  contains
  subroutine inicializarEstado()
    globalState = 0
  end subroutine inicializarEstado
end module global_variables

module moduloFuncionesRetorno
  implicit none
  type :: clase_return
    integer :: tipoOpcion
    character(len=:), allocatable :: resultado
  end type clase_return

  contains
  function analizarCadenaAAEjemplo(str, columna) result(res)
    character(len=*), intent(in) :: str
    integer, intent(in) :: columna
    type(clase_return) :: res

    ! Analizar cadenaAA
    if (str(columna:columna+1) == "aa") then
      res%tipoOpcion = columna + 2
      allocate(character(len=2) :: res%resultado)
      res%resultado = 'aa'
      return
    else
      res%tipoOpcion = -1
      allocate(character(len=1) :: res%resultado)
      res%resultado = ''
      return
    end if
  end function analizarCadenaAAEjemplo
end module moduloFuncionesRetorno

module moduloEstados
  use global_variables
  use moduloFuncionesRetorno
  implicit none
  public :: estados

  contains
  function estados(txt, columna) result(res)
    character(len=*), intent(in) :: txt
    integer, intent(in) :: columna
    type(clase_return) :: res
    character(len=:), allocatable :: alias


    if (globalState == 0) then
      allocate(character(len=1) :: alias)
      alias=" "
      res = analizarCadenaAAEjemplo(txt, columna)
      if (res%tipoOpcion == -1) then
        res%tipoOpcion = -1
        res%resultado = alias
        globalState = globalState + 1
        return
      else
        res%resultado = res%resultado
        res%tipoOpcion = res%tipoOpcion
        globalState = globalState + 1
        deallocate(alias)
        return
      end if
    else
      res%tipoOpcion = -1
      res%resultado = ''
      return
    end if
  end function estados
end module moduloEstados

module fortranModule
  use global_variables
  use moduloEstados
  implicit none
  public :: main

  contains
  subroutine main(texto, columna)
    character(len=*), intent(in) :: texto
    integer, intent(inout) :: columna
    logical :: analizar
    type(clase_return) :: res

    analizar = .true.
    call inicializarEstado()

    do while (analizar)
      res = estados(texto, columna)
      if (res%tipoOpcion == -1) then
        print *, "Error"
        analizar = .false.
      else
        print *, res%resultado
        columna = res%tipoOpcion
      end if
    end do
  end subroutine main
end module fortranModule

program fortran
  use fortranModule
  implicit none
  character(len=:), allocatable :: txt
  integer :: tam, columna

  ! Definir el tamaño de la cadena
  tam = len("aabb"//char(10))
  allocate(character(len=tam) :: txt)
  txt = "aaaabb"//char(10)

  columna = 1
  ! Llamar a la subrutina principal con los parámetros
  call main(txt, columna)

  ! Liberar la memoria
  deallocate(txt)
end program fortran