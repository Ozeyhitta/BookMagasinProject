package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Account;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.service.AccountService;
import com.bookmagasin.service.AuthService;
import com.bookmagasin.service.TokenBlacklistService;
import com.bookmagasin.util.JwtUtil;
import com.bookmagasin.web.dto.LoginDto;
import com.bookmagasin.web.dto.RegisteredCustomerDto;
import com.bookmagasin.web.dtoResponse.LoginResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AccountService accountService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthController(AuthService authService,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder,
                          AccountService accountService,
                          TokenBlacklistService tokenBlacklistService) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.accountService = accountService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    // 🔹 Đăng ký tài khoản khách hàng
    @PostMapping("/register-customer")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisteredCustomerDto dto) {
        try {
            Account account = authService.registerCustomer(dto);
            return new ResponseEntity<>(account, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // 🔹 Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {

        // 🔍 Tìm tài khoản theo email
        Optional<Account> accountOpt = accountService.findEntityByEmail(dto.getEmail());
        
        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Email hoặc mật khẩu không đúng");
        }

        Account account = accountOpt.get();

        // ❌ Kiểm tra mật khẩu
        if (!passwordEncoder.matches(dto.getPassword(), account.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Email hoặc mật khẩu không đúng");
        }

        // ❌ Tài khoản bị khóa hoặc chưa kích hoạt
        if (!account.isActivated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Tài khoản của bạn đã bị khóa! Vui lòng liên hệ quản trị viên.");
        }

        // ❌ Kiểm tra Account có User không
        if (account.getUser() == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Tài khoản không hợp lệ: thiếu thông tin người dùng. Vui lòng liên hệ quản trị viên.");
        }

        // 🔑 Sinh token đăng nhập
        String token = jwtUtil.generateToken(account.getEmail());

        ERole primaryRole = account.getPrimaryRole();
        String redirectUrl = switch (primaryRole) {
            case ADMIN -> "/admin";
            case STAFF -> "/staff";
            default -> "/";
        };

        Set<String> roleNames = account.getRoles().stream()
                .map(role -> role.getRole().name())
                .collect(Collectors.toSet());

        // 🔄 Trả về thông tin login
        return ResponseEntity.ok(new LoginResponseDto(
                account.getUser().getId(),   // USER ID
                account.getEmail(),
                primaryRole.name(),
                token,
                redirectUrl,
                roleNames
        ));
    }


    // 🔹 Đăng xuất
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.addToken(token);
            return ResponseEntity.ok("Đăng xuất thành công!");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy token để đăng xuất");
    }
}