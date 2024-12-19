
export const analizarLiterales = 
`
  function analizarLiterales(str,columna) result(res)
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
  end function analizarLiterales
`

export const analizarIdentificador = 
`
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
`

export default { analizarLiterales };