package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.enums.ERole;
import com.bookmagasin.web.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponseDto {
    private int id;
    private String email;
    private ERole role;
    private boolean activated;
    private UserDto user;
}
