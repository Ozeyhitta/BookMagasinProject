package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.User;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.AccountService;
import com.bookmagasin.web.dto.AccountDto;
import com.bookmagasin.web.dtoResponse.AccountResponseDto;
import com.bookmagasin.web.mapper.AccountMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountServiceImpl(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }


    @Override
    public AccountResponseDto create(AccountDto dto) {
        User user=userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));
        Account account=AccountMapper.toEntity(dto, user);
        Account saved=accountRepository.save(account);
        return AccountMapper.toResponseDto(saved);
    }



    @Override
    public AccountResponseDto update(int id, AccountDto dto) {
        Account existing=accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: "+id));
        existing.setEmail(dto.getEmail());
        existing.setPassword(dto.getPassword());
        existing.setRole(dto.getRole());
        existing.setActivated(dto.isActivated());

        if(dto.getUserId()>0){
            User user=userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " +dto.getUserId()));
            existing.setUser(user);
        }
        Account updated=accountRepository.save(existing);
        return AccountMapper.toResponseDto(updated);
    }

    @Override
    public AccountResponseDto getById(int id) {
        Account account=accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
        return AccountMapper.toResponseDto(account);
    }


    @Override
    public AccountResponseDto getByEmail(String email) {
        Account account=accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found with email: " + email));
        return AccountMapper.toResponseDto(account);
    }

    @Override
    public List<AccountResponseDto> getAll() {
        return accountRepository.findAll()
                .stream()
                .map(AccountMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public void deletedById(int id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
        // Ngắt liên kết để tránh lỗi constraint
        if (account.getUser() != null) {
            account.setUser(null);
        }
        accountRepository.delete(account);
    }



}
