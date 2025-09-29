package com.bookmagasin.service;


import com.bookmagasin.entity.Account;
import com.bookmagasin.web.dto.AccountDto;
import com.bookmagasin.web.dtoResponse.AccountResponseDto;

import java.util.List;
import java.util.Optional;

public interface AccountService {
    AccountResponseDto create(AccountDto dto);
    AccountResponseDto update(int id,AccountDto dto);
    AccountResponseDto getById(int id);
    AccountResponseDto getByEmail(String email);
    List<AccountResponseDto> getAll();
    boolean existsByEmail(String email);
    void deletedById(int id);



}
