package com.bookmagasin.web.dtoResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    private int userId;
    private String email;
    private String role;
    private String token;
    private String redirectUrl;
    private Set<String> roles;
}
