package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Role;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.AccountService;
import com.bookmagasin.service.RoleService;
import com.bookmagasin.web.dto.AccountDto;
import com.bookmagasin.web.dtoResponse.AccountResponseDto;
import com.bookmagasin.web.mapper.AccountMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final RoleService roleService;

    public AccountServiceImpl(AccountRepository accountRepository, UserRepository userRepository, RoleService roleService) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.roleService = roleService;
    }


    @Override
    public AccountResponseDto create(AccountDto dto) {
        User user=userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));
        Account account=AccountMapper.toEntity(dto, user);
        applyRoles(account, resolveRequestedRoles(dto));
        Account saved=accountRepository.save(account);
        return AccountMapper.toResponseDto(saved);
    }



    @Override
    public AccountResponseDto update(int id, AccountDto dto) {
        Account existing=accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: "+id));
        existing.setEmail(dto.getEmail());
        existing.setPassword(dto.getPassword());
        existing.setActivated(dto.isActivated());
        applyRoles(existing, resolveRequestedRoles(dto));

        if(dto.getUserId()>0){
            User user=userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " +dto.getUserId()));
            existing.setUser(user);
        }
        Account updated=accountRepository.save(existing);
        return AccountMapper.toResponseDto(updated);
    }

    @Override
    public AccountResponseDto getById(int id) {
        Account account=accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
        return AccountMapper.toResponseDto(account);
    }


    @Override
    public AccountResponseDto getByEmail(String email) {
        Account account=accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found with email: " + email));
        return AccountMapper.toResponseDto(account);
    }

    @Override
    public Optional<Account> findEntityByEmail(String email) {
        return accountRepository.findByEmail(email);
    }


    @Override
    public List<AccountResponseDto> getAll() {
        return accountRepository.findAll()
                .stream()
                .map(AccountMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public void deletedById(int id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
        // Ngắt liên kết để tránh lỗi constraint
        if (account.getUser() != null) {
            account.setUser(null);
        }
        accountRepository.delete(account);
    }

    @Override
    public AccountResponseDto toggleActivated(int id) {
        Account acc = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        acc.setActivated(!acc.isActivated());
        accountRepository.save(acc);

        return AccountMapper.toResponseDto(acc);

    }

    private void applyRoles(Account account, Set<ERole> roles) {
        Set<Role> resolved = new HashSet<>(roleService.getOrCreateRoles(roles));
        account.getRoles().clear();
        account.getRoles().addAll(resolved);
    }

    private Set<ERole> resolveRequestedRoles(AccountDto dto) {
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            return dto.getRoles();
        }
        if (dto.getRole() != null) {
            return Set.of(dto.getRole());
        }
        return Set.of(ERole.CUSTOMER);
    }


}
