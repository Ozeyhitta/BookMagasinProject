package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.PasswordResetToken;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.PasswordResetTokenRepository;
import com.bookmagasin.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final AccountRepository accountRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void createResetToken(String email) {

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email: " + email));

        tokenRepository.deleteByAccount_Id(account.getId());
        tokenRepository.flush();

        String otp = String.format("%06d", new Random().nextInt(999999));

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .otp(otp)
                .account(account)
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .build();

        tokenRepository.save(resetToken);

        sendResetEmail(email, otp);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {

        PasswordResetToken token = tokenRepository.findByAccountEmail(email)
                .orElse(null);

        if (token == null) return false;
        if (!token.getOtp().equals(otp)) return false;
        if (token.isExpired()) return false;

        // ✅ Xóa token ngay khi OTP đúng
        tokenRepository.delete(token);

        return true;
    }


    private void sendResetEmail(String email, String otp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Mã OTP khôi phục mật khẩu");
        msg.setText("Mã OTP của bạn là: " + otp
                + "\nMã hết hạn sau 5 phút.");

        mailSender.send(msg);
    }

    /**
     * Validates password strength:
     * - At least 8 characters
     * - At least 1 uppercase letter
     * - At least 1 lowercase letter
     * - At least 1 special character (!@#$%^&*)
     * - At least 1 digit
     */
    private void validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống");
        }

        // Regex explanation:
        // ^(?=.*[a-z])  - Lookahead: must contain at least one lowercase letter
        // (?=.*[A-Z])   - Lookahead: must contain at least one uppercase letter
        // (?=.*[!@#$%^&*]) - Lookahead: must contain at least one special character
        // (?=.*\d)      - Lookahead: must contain at least one digit
        // .{8,}$        - At least 8 characters total
        String strongPasswordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d).{8,}$";
        
        if (!password.matches(strongPasswordRegex)) {
            throw new IllegalArgumentException(
                "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*)"
            );
        }
    }

    @Override
    @Transactional
    public void resetPassword(String email, String newPassword) {

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        // Validate password strength before resetting
        validatePassword(newPassword);

        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
    }

}
