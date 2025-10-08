package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Account;
import com.bookmagasin.service.AccountService;


import com.bookmagasin.service.AuthService;
import com.bookmagasin.service.TokenBlacklistService;
import com.bookmagasin.util.JwtUtil;
import com.bookmagasin.web.dto.LoginDto;
import com.bookmagasin.web.dto.RegisterCustomerDto;
import com.bookmagasin.web.dtoResponse.LoginResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AccountService accountService;
    private final TokenBlacklistService tokenBlacklistService;


    public AuthController(AuthService authService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, AccountService accountService, TokenBlacklistService tokenBlacklistService) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.accountService = accountService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/register-customer")
    public ResponseEntity<Account> registerCustomer(@RequestBody RegisterCustomerDto dto) {
        Account account = authService.registerCustomer(dto);
        return new ResponseEntity<>(account, HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        Account account = accountService.findEntityByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (!passwordEncoder.matches(dto.getPassword(), account.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai mật khẩu");
        }


        String token = jwtUtil.generateToken(account.getEmail());



        return ResponseEntity.ok(new LoginResponseDto(
                account.getId(),
                account.getEmail(),
                account.getRole().name(),
                token
        ));
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        System.out.println(">>> Authorization header = " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.addToken(token);
            return ResponseEntity.ok("Đăng xuất thành công!");
        }

        return ResponseEntity.badRequest().body("Không tìm thấy token để đăng xuất");
    }


}

