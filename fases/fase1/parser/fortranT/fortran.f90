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
    character(len=:), allocatable :: resultado
    integer :: tipoOpcion
  end type clase_return

  contains
  function analizarCadenaAAEjemplo(str, columna) result(res)
    character(len=*), intent(in) :: str
    integer, intent(in) :: columna
    type(clase_return) :: res

    ! Analizar cadenaAA
    if (str(columna:columna+1) == "aa") then
      allocate(character(len=2) :: res%resultado)!no se si se necesita el len=2
      res%resultado = 'aa'
      res%tipoOpcion = columna + 2!aumnento columna cuando se encuentra aa
      return
    else
      allocate(character(len=1) :: res%resultado)!no se si se necesita el len=2g
      res%resultado = ' '
      res%tipoOpcion = -1
      return
    end if
  end function analizarCadenaAAEjemplo
  
  !analizar string con, comillas simples o dobles
  function analizarStringComillas(str,columna) result(res)
    character(len=*), intent(in) :: str
    integer, intent(in) :: columna
    type(clase_return) :: res
    integer :: estadosInternos, i, ascii
    logical :: bandera
    estadosInternos = 0
    i = columna
    ascii=0
    bandera = .true.

    do while (bandera)
      !if (i <= len_trim(str)) then !para que no se salga del rango de la cadena de texto, posible ciclo infinito, error de cadena
      !  allocatable(character(len=1)) :: res%resultado)
      !  res%resultado = ''
      !  res%tipoOpcion = -1
      !  bandera = .false.

      !estado 0
        if(estadosInternos==0 .and. str(i:i)==char(34)) then !34="
          estadosInternos = 1
          ascii = 34
          i=i+1
        else if (estadosInternos==0 .and. str(i:i)==char(39)) then !39='
          estadosInternos = 1
          ascii = 39
          i=i+1
      
      !estado 1
        else if (estadosInternos==1 .and. str(i:i)==char(92)) then !92= barrainvertida
          estadosInternos=2
          i=i+1
        else if (estadosInternos==1 .and. str(i:i)==char(ascii)) then !34=" o 39='
          estadosInternos = 5
          allocate(character(len=len(str(columna:i))) :: res%resultado)
          res%resultado = str(columna:i)
          i=i+1
          res%tipoOpcion = i
          bandera = .false.
        else if (estadosInternos==1 .and. str(i:i)/=char(ascii)) then ! diferente a 34=" o 39='
        estadosInternos = 4
        i=i+1

      !estado 2 !92= barrainvertida !8= retroceso !12= salto de pagina !10= salto de linea !13= retorno de carro !9= tabulacion !11= tabulacion vertical !117= unicode !34=" o 39='
        else if (estadosInternos == 2 .and. (str(i:i) == char(92) .or. str(i:i) == "b" .or. str(i:i) == "f" .or. str(i:i) == "n" .or. str(i:i) == "r" .or. str(i:i) == "t" .or. str(i:i) == "v" .or. str(i:i) == "u" .or. str(i:i) == char(ascii))) then
          estadosInternos = 3
          i = i + 1
        
      !estado 3
        else if (estadosInternos==3 .and. str(i:i)==char(92)) then !92= barrainvertida
          estadosInternos=2
          i=i+1
        else if (estadosInternos==3 .and. str(i:i)==char(ascii)) then !34=" o 39='
          estadosInternos = 5
          allocate(character(len=len(str(columna:i))) :: res%resultado)
          res%resultado = str(columna:i)
          i=i+1
          res%tipoOpcion = i
          bandera = .false.
        else if (estadosInternos==3 .and. str(i:i)/=char(ascii)) then ! diferente a 34=" o 39='
          estadosInternos = 4
          i=i+1
      
      !estado 4
        else if (estadosInternos==4 .and. str(i:i)==char(92)) then !92= barrainvertida
          estadosInternos=2
          i=i+1
        else if (estadosInternos==4 .and. str(i:i)==char(ascii)) then !34=" o 39='
          estadosInternos = 5
          allocate(character(len=len(str(columna:i))) :: res%resultado)
          res%resultado = str(columna:i)
          i=i+1
          res%tipoOpcion = i
          bandera = .false.
        else if (estadosInternos==4 .and. str(i:i)/=char(ascii)) then ! diferente a 34=" o 39='
          estadosInternos = 4
          i=i+1
      
      !estado 5
      else if (estadosInternos==5) then
        bandera = .false.

      !error posible
      else
        bandera = .false.
      end if
    end do
  end function analizarStringComillas
  
  function analizarIdentificador(str, columna) result(res)
    character(len=*), intent(in) :: str
    integer, intent(in) :: columna
    type(clase_return) :: res
    integer :: i

    i = columna
    allocate(character(len=0) :: res%resultado)
    res%tipoOpcion = -1

    ! ! Ignorar espacios en blanco
    ! do while (i <= len_trim(str) .and. str(i:i) == ' ')
    !   i = i + 1
    ! end do

    ! Verificamos que el primer carácter sea un identificador válido
    if (i <= len_trim(str) .and. (str(i:i) >= 'a' .and. str(i:i) <= 'z' .or. &
                                   str(i:i) >= 'A' .and. str(i:i) <= 'Z' .or. &
                                   str(i:i) == '_')) then
      ! Comenzamos a construir el identificador
      do while (i <= len_trim(str) .and. &
                 (str(i:i) >= 'a' .and. str(i:i) <= 'z' .or. &
                  str(i:i) >= 'A' .and. str(i:i) <= 'Z' .or. &
                  str(i:i) >= '0' .and. str(i:i) <= '9' .or. &
                  str(i:i) == '_'))
        res%resultado = trim(res%resultado) // str(i:i)  ! Concatenamos el carácter al resultado
        i = i + 1
      end do
      res%tipoOpcion = i  ! Actualizamos la posición de la columna

      ! ! Imprimir el identificador encontrado
      ! print *, "Identificador encontrado:", trim(res%resultado)
    else
      res%resultado = ' '  ! No se encontró un identificador válido
    end if
  end function analizarIdentificador

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

    if (globalState==-99) then !solo para utilizar else ifs
    else if (globalState == 0) then
      allocate(character(len=1) :: alias)
      alias=" "
      res = analizarIdentificador(txt, columna)
      if (res%tipoOpcion == -1) then
        res%resultado = alias
        res%tipoOpcion = -1
        globalState = globalState + 1!para no ciclo infintio
        return
      else
        res%resultado = res%resultado
        res%tipoOpcion = res%tipoOpcion
        globalState = globalState + 1!para no ciclo infintio
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
  ! tam = len(char(34)//"aa"//char(92)//"nbb"//char(34))
  ! allocate(character(len=tam) :: txt)
  ! txt = char(34)//"aa"//char(92)//"nbb"//char(34)
  

  ! Definir la cadena para probar identificadores
  txt = "_temp"

  columna = 1
  ! Llamar a la subrutina principal con los parámetros
  call main(txt, columna)
  
  ! Liberar la memoria
  deallocate(txt)
end program fortran