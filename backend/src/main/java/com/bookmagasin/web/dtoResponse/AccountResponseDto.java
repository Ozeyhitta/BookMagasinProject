package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.enums.ERole;
import com.bookmagasin.web.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponseDto {
    private int id;
    private String email;
    private ERole role; // Backward compatibility - trả về role đầu tiên
    private Set<ERole> roles; // Danh sách tất cả roles
    private boolean activated;
    private UserDto user;
}
