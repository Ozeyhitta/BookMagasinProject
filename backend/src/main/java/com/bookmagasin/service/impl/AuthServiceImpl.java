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

    /**
     * Validates password strength:
     * - At least 8 characters
     * - At least 1 uppercase letter
     * - At least 1 lowercase letter
     * - At least 1 special character (!@#$%^&*)
     * - At least 1 digit (optional but recommended)
     */
    private void validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống");
        }

        // Regex explanation:
        // ^(?=.*[a-z])  - Lookahead: must contain at least one lowercase letter
        // (?=.*[A-Z])   - Lookahead: must contain at least one uppercase letter
        // (?=.*[!@#$%^&*]) - Lookahead: must contain at least one special character
        // (?=.*\d)      - Lookahead: must contain at least one digit (optional)
        // .{8,}$        - At least 8 characters total
        String strongPasswordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d).{8,}$";
        
        if (!password.matches(strongPasswordRegex)) {
            throw new IllegalArgumentException(
                "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*)"
            );
        }
    }

    @Override
    public Account registerCustomer(RegisteredCustomerDto dto) {

        if (accountRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng!");
        }

        // Validate password strength before creating account
        validatePassword(dto.getPassword());

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
