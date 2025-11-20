package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.AccountDto;
import com.bookmagasin.web.dto.UserDto;
import com.bookmagasin.web.dtoResponse.AccountResponseDto;

public class AccountMapper {


    public static Account toEntity(AccountDto dto, User user){
        Account account=new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(dto.getPassword());
        account.setRole(dto.getRole());
        account.setActivated(dto.isActivated());
        account.setUser(user);
        return account;
    }

    public static AccountResponseDto toResponseDto(Account account){
        AccountResponseDto dto = new AccountResponseDto();

        dto.setId(account.getId());
        dto.setEmail(account.getEmail());

        // Tạo Set chứa 1 role để tương thích với frontend
        if (account.getRole() != null) {
            dto.setRoles(java.util.Collections.singleton(account.getRole()));
        } else {
            dto.setRoles(new java.util.HashSet<>());
        }
        dto.setActivated(account.isActivated());

        if (account.getUser() != null) {
            dto.setUser(UserMapper.toDto(account.getUser()));
        }else {
            dto.setUser(null);
        }

        return dto;
    }

}
