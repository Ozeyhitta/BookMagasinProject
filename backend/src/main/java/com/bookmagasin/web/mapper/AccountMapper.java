package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Role;
import com.bookmagasin.entity.User;
import com.bookmagasin.web.dto.AccountDto;
import com.bookmagasin.web.dtoResponse.AccountResponseDto;

import java.util.Set;
import java.util.stream.Collectors;

public class AccountMapper {


    public static Account toEntity(AccountDto dto, User user){
        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(dto.getPassword());
        account.setActivated(dto.isActivated());
        account.setUser(user);
        return account;
    }

    public static AccountResponseDto toResponseDto(Account account){
        AccountResponseDto dto = new AccountResponseDto();

        dto.setId(account.getId());
        dto.setEmail(account.getEmail());

        Set<Role> accountRoles = account.getRoles();
        dto.setRole(account.getPrimaryRole());
        dto.setRoles(accountRoles.stream()
                .map(role -> role.getRole())
                .collect(Collectors.toSet()));
        dto.setActivated(account.isActivated());

        if (account.getUser() != null) {
            dto.setUser(UserMapper.toDto(account.getUser()));
        }else {
            dto.setUser(null);
        }

        return dto;
    }

}
