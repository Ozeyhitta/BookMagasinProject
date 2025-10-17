package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.RegisteredCustomer;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.RegisteredCustomerRepository;
import com.bookmagasin.service.AuthService;
import com.bookmagasin.web.dto.RegisteredCustomerDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthServiceImpl implements AuthService {

    private final RegisteredCustomerRepository registeredCustomerRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(RegisteredCustomerRepository registeredCustomerRepository,
                           AccountRepository accountRepository,
                           PasswordEncoder passwordEncoder) {
        this.registeredCustomerRepository = registeredCustomerRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Account registerCustomer(RegisteredCustomerDto dto) {
        // 1️⃣ Kiểm tra email đã tồn tại chưa
        if (accountRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // 2️⃣ Tạo account
        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setRole(ERole.CUSTOMER);
        account.setActivated(true);
        account = accountRepository.save(account);

        // 3️⃣ Tạo registered customer
        RegisteredCustomer customer = new RegisteredCustomer();
        customer.setFullName(dto.getFullName());
        customer.setAccount(account);
        customer.setRegistrationDate(new Date());
        customer.setLoyalPoint(0);

        registeredCustomerRepository.save(customer);

        // 4️⃣ Liên kết 2 chiều
        account.setUser(customer);
        return accountRepository.save(account);
    }
}
