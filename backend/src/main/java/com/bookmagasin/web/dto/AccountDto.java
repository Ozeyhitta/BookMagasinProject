package com.bookmagasin.web.dto;

import com.bookmagasin.enums.ERole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {
    private String email;
    private String password;
    /**
     * @deprecated dùng trường roles để hỗ trợ nhiều role cho một account.
     */
    @Deprecated
    private ERole role;
    private Set<ERole> roles;
    private boolean activated;
    private int userId;

}
