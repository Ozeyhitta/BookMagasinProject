package com.bookmagasin.web.dto;

import com.bookmagasin.enums.ERole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {
    private String email;
    private String password;
    private ERole role;
    private boolean activated;
    private int userId;

}
