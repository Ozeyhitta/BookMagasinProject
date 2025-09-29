package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Account;
import com.bookmagasin.service.impl.AuthService;
import com.bookmagasin.web.dto.RegisterCustomerDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register-customer")
    public ResponseEntity<Account> registerCustomer(@RequestBody RegisterCustomerDto dto) {
        Account account = authService.registerCustomer(dto);
        return new ResponseEntity<>(account, HttpStatus.CREATED);
    }
}

