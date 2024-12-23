
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

    function nextsym(input) result(lexval)
        character(len=:), intent(inout), allocatable :: input
        character(len=:), allocatable :: lexval
        integer :: i
        logical :: is_int, is_str, is_space

        lexval = ""
        i = 1
        is_int = .false.
        is_str = .false.
        is_space = .false.

        do while (i <= len(input))
            ! integer
            if (input(i:i) >= '0' .and. input(i:i) <= '9') then
                if (is_str) then
                    input = input(i:)
                    lexval = lexval // ' - string'
                    return
                else if (is_space) then
                    input = input(i:)
                    lexval = lexval // ' - whitespace'
                    return
                end if
                is_int = .true.
                lexval = lexval // input(i:i)
            
            ! string
            else if (input(i:i) >= 'A' .and. input(i:i) <= 'Z' .or. input(i:i) >= 'a' .and. input(i:i) <= 'z') then
                if (is_int) then
                    input = input(i:)
                    lexval = lexval // ' - integer'
                    return
                else if (is_space) then
                    input = input(i:)
                    lexval = lexval // ' - whitespace'
                    return
                end if
                is_str = .true.
                lexval = lexval // input(i:i)           
            
            ! error
            else
                if (is_int) then
                    input = input(i:)
                    lexval = lexval // ' - integer'
                    return
                else if (is_str) then
                    input = input(i:)
                    lexval = lexval // ' - string'
                    return
                end if
                lexval = input(i:i) // " - error"
                input = input(i+1:)
                return
            end if

            i = i + 1
        end do

        ! eof
        input = input(i:)
        if (is_int) then
            input = input(i:)
            lexval = lexval // ' - integer'// char(10) //' \0 - eof'
            return
        else if (is_space) then
            input = input(i:)
            lexval = lexval // ' - whitespace'// char(10) //' \0 - eof'
            return
        else if (is_str) then
            input = input(i:)
            lexval = lexval // ' - string'// char(10) //' \0 - eof'
            return
    end if
    
end function nextsym
end module tokenizer
  
  
  

program parser
    use tokenizer
    implicit none
    character(len=:), allocatable :: input
    input="123456abcd"

     do while (len(input) > 0)
        print *, nextsym(input)
    end do
end program parser