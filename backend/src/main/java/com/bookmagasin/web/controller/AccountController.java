package com.bookmagasin.web.controller;

import com.bookmagasin.service.AccountService;
import com.bookmagasin.web.dto.AccountDto;
import com.bookmagasin.web.dtoResponse.AccountResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000") // ✅ CHO PHÉP FRONTEND 3000 GỌI API NÀY
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // 🟢 Create Account
    @PostMapping
    public ResponseEntity<AccountResponseDto> createAccount(@RequestBody AccountDto dto) {
        if (accountService.existsByEmail(dto.getEmail())) {
            // Có thể trả về message chi tiết hơn nếu muốn
            return ResponseEntity.badRequest().body(null);
        }
        AccountResponseDto created = accountService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // 🔵 Read all Accounts
    @GetMapping
    public ResponseEntity<List<AccountResponseDto>> getAllAccounts() {
        List<AccountResponseDto> list = accountService.getAll();
        return ResponseEntity.ok(list);
    }

    // 🔵 Read Account by ID
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseDto> getAccountById(@PathVariable int id) {
        AccountResponseDto dto = accountService.getById(id);
        return ResponseEntity.ok(dto);
    }

    // 🔵 Read Account by Email
    @GetMapping("/email/{email}")
    public ResponseEntity<AccountResponseDto> getAccountByEmail(@PathVariable String email) {
        AccountResponseDto dto = accountService.getByEmail(email);
        return ResponseEntity.ok(dto);
    }

    // 🟠 Update Account
    @PutMapping("/{id}")
    public ResponseEntity<AccountResponseDto> updateAccount(@PathVariable int id, @RequestBody AccountDto dto) {
        AccountResponseDto updated = accountService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    // 🟣 Toggle kích hoạt / khóa tài khoản
    @PutMapping("/{id}/toggle")
    public ResponseEntity<AccountResponseDto> toggleAccount(@PathVariable int id) {
        AccountResponseDto dto = accountService.toggleActivated(id);
        return ResponseEntity.ok(dto);
    }

    // ⚫ Delete Account
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable int id) {
        accountService.deletedById(id);
        return ResponseEntity.noContent().build();
    }
}
