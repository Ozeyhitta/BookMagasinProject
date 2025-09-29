package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.RegisteredCustomer;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.RegisteredCustomerRepository;
import com.bookmagasin.service.RegisteredCustomerService;
import com.bookmagasin.web.dto.RegisteredCustomerDto;
import com.bookmagasin.web.dtoResponse.RegisteredCustomerResponseDto;
import com.bookmagasin.web.mapper.RegisteredCustomerMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegisteredCustomerServiceImpl implements RegisteredCustomerService {
    private final RegisteredCustomerRepository registeredCustomerRepository;
    private final AccountRepository accountRepository;

    public RegisteredCustomerServiceImpl(RegisteredCustomerRepository registeredCustomerRepository, AccountRepository accountRepository) {
        this.registeredCustomerRepository = registeredCustomerRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public RegisteredCustomerResponseDto create(RegisteredCustomerDto dto) {
        Account account = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        RegisteredCustomer rc = RegisteredCustomerMapper.toEntity(dto, account);
        return RegisteredCustomerMapper.toResponseDto(registeredCustomerRepository.save(rc));
    }

    @Override
    public List<RegisteredCustomerResponseDto> getAll() {
        return registeredCustomerRepository.findAll()
                .stream()
                .map(RegisteredCustomerMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public RegisteredCustomerResponseDto getById(int id) {
        RegisteredCustomer rc = registeredCustomerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registered customer not found"));
        return RegisteredCustomerMapper.toResponseDto(rc);
    }

    @Override
    public RegisteredCustomerResponseDto update(int id, RegisteredCustomerDto dto) {
        RegisteredCustomer rc = registeredCustomerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registered customer not found"));

        rc.setFullName(dto.getFullName());
        rc.setDateOfBirth(dto.getDateOfBirth());
        rc.setGender(dto.getGender());
        rc.setPhoneNumber(dto.getPhoneNumber());
        rc.setAddress(dto.getAddress());
        rc.setAvatarUrl(dto.getAvatarUrl());
        rc.setLoyalPoint(dto.getLoyalPoint());

        if (dto.getAccountId() > 0) {
            Account account = accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            rc.setAccount(account);
        }

        return RegisteredCustomerMapper.toResponseDto(registeredCustomerRepository.save(rc));
    }

    @Override
    public void delete(int id) {
        RegisteredCustomer rc = registeredCustomerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registered customer not found"));
        registeredCustomerRepository.delete(rc);
    }
}
