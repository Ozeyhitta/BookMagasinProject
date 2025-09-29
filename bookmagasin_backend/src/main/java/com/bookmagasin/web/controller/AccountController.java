package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Account;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.service.AccountService;
import com.bookmagasin.web.dto.AccountDto;
import com.bookmagasin.web.dtoResponse.AccountResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // 🟢 Create Account
    @PostMapping
    public ResponseEntity<AccountResponseDto> createAccount(@RequestBody AccountDto dto) {
        if (accountService.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body(null);  // Trả về lỗi nếu email đã tồn tại
        }
        AccountResponseDto created = accountService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // 🔵 Read all Accounts
    @GetMapping
    public ResponseEntity<List<AccountResponseDto>> getAllAccounts() {
        List<AccountResponseDto> list=accountService.getAll();
        return ResponseEntity.ok(list);
    }

    // 🔵 Read Account by ID
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseDto> getAccountById(@PathVariable int id) {
        AccountResponseDto dto=accountService.getById(id);
        return ResponseEntity.ok(dto);
    }

    // 🔵 Read Account by Email
    @GetMapping("/email/{email}")
    public ResponseEntity<AccountResponseDto> getAccountByEmail(@PathVariable String email) {
        AccountResponseDto dto=accountService.getByEmail(email);
        return ResponseEntity.ok(dto);
    }

    // 🔴 Update Account
    @PutMapping("/{id}")
    public ResponseEntity<AccountResponseDto> updateAccount(@PathVariable int id, @RequestBody AccountDto dto) {
        AccountResponseDto updated=accountService.update(id,dto);
        return ResponseEntity.ok(updated);

    }

    // ⚫ Delete Account
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable int id) {
        accountService.deletedById(id);
        return ResponseEntity.noContent().build();
    }
}
