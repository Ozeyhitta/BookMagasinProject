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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final AccountRepository accountRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    /**
     * Gửi email reset mật khẩu và lưu token reset
     */
    @Override
    @Transactional
    public void createResetToken(String email) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email: " + email));

        // Xóa token cũ (nếu có)
        tokenRepository.deleteByAccount_Id(account.getId());
        tokenRepository.flush(); // ✅ Bắt buộc xóa ngay, tránh duplicate

        // Tạo token mới
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .account(account)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();

        tokenRepository.save(resetToken);

        sendResetEmail(email, token);
    }


    /**
     * Gửi email khôi phục mật khẩu
     */
    private void sendResetEmail(String email, String token) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Khôi phục mật khẩu");
        message.setText(
                "Xin chào,\n\n" +
                        "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n" +
                        "Vui lòng nhấn vào liên kết sau để đặt lại mật khẩu (liên kết hết hạn sau 15 phút):\n\n" +
                        resetLink + "\n\n" +
                        "Nếu bạn không yêu cầu, vui lòng bỏ qua email này.\n\n" +
                        "Trân trọng,\nBookMagasin Team"
        );

        mailSender.send(message);
    }

    /**
     * Đặt lại mật khẩu bằng token hợp lệ
     */
    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ!"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Token đã hết hạn!");
        }

        Account account = resetToken.getAccount();
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

        // Xóa token sau khi dùng
        tokenRepository.delete(resetToken);
    }
}
