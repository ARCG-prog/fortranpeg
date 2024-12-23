program AutomataValidator
  implicit none
  character(len=100) :: inputString
  integer :: currentState, i
  logical :: isAccepted
  logical :: continueLoop  ! Variable de control para el ciclo

  print *, 'Enter a string to validate:'
  read(*,*) inputString

  currentState = 2
  isAccepted = .false.
  continueLoop = .true.  ! Inicializamos la variable de control

  do i = 1, len_trim(inputString)
    if (.not. continueLoop) exit  ! Salir del ciclo si continueLoop es falso

    select case(currentState)
      case (0)
        if (i > len_trim(inputString)) exit
        select case(inputString(i:i))
          case ('a')
            currentState = 1
            exit
          case ('c')
            currentState = 0
            exit
          case ('d')
            currentState = 0
            exit
          case default
            print *, 'The string is rejected. Invalid character in state 0.'
            continueLoop = .false.
            exit
        end select
        if (i == len_trim(inputString)) then
          isAccepted = .true.
          continueLoop = .false.
        else if (i < len_trim(inputString)) then
          print *, 'The string is rejected. Extra characters found after final state.'
          continueLoop = .false.
        end if
      case (1)
        print *, 'The string is rejected. No transitions available from state 1.'
        continueLoop = .false.
        if (i == len_trim(inputString)) then
          isAccepted = .true.
          continueLoop = .false.
        else if (i < len_trim(inputString)) then
          print *, 'The string is rejected. Extra characters found after final state.'
          continueLoop = .false.
        end if
      case (2)
        if (i > len_trim(inputString)) exit
        select case(inputString(i:i))
          case ('a')
            currentState = 0
            exit
          case ('b')
            currentState = 0
            exit
          case ('c')
            currentState = 0
            exit
          case default
            print *, 'The string is rejected. Invalid character in state 2.'
            continueLoop = .false.
            exit
        end select
      case default
        print *, 'Error: Invalid state or transition.'
        continueLoop = .false.
    end select
  end do

  ! Verificar estado final
  select case(currentState)
    case (0)
      isAccepted = .true.
    case (1)
      isAccepted = .true.
    case default
      isAccepted = .false.
  end select

  if (isAccepted) then
    print *, 'The string is accepted.'
  else
    print *, 'The string is rejected.'
  end if
end program AutomataValidator