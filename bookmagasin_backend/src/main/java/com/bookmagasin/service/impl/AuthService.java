package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.RegisteredCustomer;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.RegisteredCustomerRepository;
import com.bookmagasin.web.dto.RegisterCustomerDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {

    private final RegisteredCustomerRepository registeredCustomerRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(RegisteredCustomerRepository registeredCustomerRepository,
                       AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder) {
        this.registeredCustomerRepository = registeredCustomerRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Account registerCustomer(RegisterCustomerDto dto) {
        // 1. Tạo RegisteredCustomer
        RegisteredCustomer customer = new RegisteredCustomer();
        customer.setFullName(dto.getFullName());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer.setGender(dto.getGender());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setAddress(dto.getAddress());
        customer.setAvatarUrl(dto.getAvatarUrl());
        customer.setRegistrationDate(new Date());
        customer.setLoyalPoint(0);
        registeredCustomerRepository.save(customer);

        // 2. Tạo Account
        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword())); // hash
        account.setRole(ERole.CUSTOMER);
        account.setActivated(true);
        account.setUser(customer);

        return accountRepository.save(account);
    }
}

