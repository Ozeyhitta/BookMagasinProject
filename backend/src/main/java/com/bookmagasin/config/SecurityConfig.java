package com.bookmagasin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Mã hóa password (dùng cho đăng ký / đăng nhập sau này)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Cấu hình security chính
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF vì mình đang làm REST API
                .csrf(csrf -> csrf.disable())
                // Bật CORS, dùng cấu hình ở bean corsConfigurationSource()
                .cors(Customizer.withDefaults())
                // PHÂN QUYỀN
                .authorizeHttpRequests(auth -> auth
                        // Cho phép TẤT CẢ request (dev cho dễ, sau này siết lại sau)
                        .anyRequest().permitAll()
                )
                // Không dùng session stateful (chuẩn REST, hợp với JWT sau này)
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }

    // Cấu hình CORS cho toàn bộ API
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Frontend Next/React ở cổng 3000
        config.setAllowedOrigins(List.of("http://localhost:3000"));

        // Nếu muốn test bằng Postman, hoặc nhiều origin khác, dùng wildcard pattern
        // Lưu ý: dùng "*" thì bắt buộc allowCredentials = false
        config.setAllowedOriginPatterns(List.of("*"));

        // Các method được phép
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Cho phép tất cả header
        config.setAllowedHeaders(List.of("*"));

        // Không gửi cookie/credentials kèm request vì dùng wildcard origin
        config.setAllowCredentials(false);

        // Thời gian cache cấu hình CORS (giây)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Áp dụng cho toàn bộ path
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
