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
        AccountResponseDto dto=new AccountResponseDto();
        dto.setId(account.getId());
        dto.setEmail(account.getEmail());
        dto.setRole(account.getRole());
        dto.setActivated(account.isActivated());
        if(account.getUser()!=null){
            UserDto userDto=new UserDto();
            userDto.setId(account.getUser().getId());
            userDto.setFullName(account.getUser().getFullName());
            dto.setUser(userDto);
        }
        return dto;
    }
}
