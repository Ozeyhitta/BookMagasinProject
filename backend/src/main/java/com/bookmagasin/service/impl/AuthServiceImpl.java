package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.RegisteredCustomer;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.RegisteredCustomerRepository;
import com.bookmagasin.service.AuthService;
import com.bookmagasin.service.RoleService;
import com.bookmagasin.web.dto.RegisteredCustomerDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthServiceImpl implements AuthService {

    private final RegisteredCustomerRepository registeredCustomerRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    public AuthServiceImpl(RegisteredCustomerRepository registeredCustomerRepository,
                           AccountRepository accountRepository,
                           PasswordEncoder passwordEncoder,
                           RoleService roleService) {
        this.registeredCustomerRepository = registeredCustomerRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }

    @Override
    public Account registerCustomer(RegisteredCustomerDto dto) {

        if (accountRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng!");
        }

        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.addRole(roleService.getOrCreateRole(ERole.CUSTOMER));
        account.setActivated(true);
        account = accountRepository.save(account);

        RegisteredCustomer customer = new RegisteredCustomer();
        customer.setFullName(dto.getFullName());
        customer.setAccount(account);
        customer.setRegistrationDate(new Date());
        customer.setLoyalPoint(0);

        registeredCustomerRepository.save(customer);

        account.setUser(customer);
        return accountRepository.save(account);
    }

}
