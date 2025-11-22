package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Staff;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.StaffRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.RoleService;
import com.bookmagasin.service.StaffService;
import com.bookmagasin.web.dto.StaffRequestDto;
import com.bookmagasin.web.dtoResponse.StaffResponseDto;
import com.bookmagasin.web.mapper.StaffMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class StaffServiceImpl implements StaffService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final RoleService roleService;
    private final StaffMapper staffMapper;

    public StaffServiceImpl(AccountRepository accountRepository, UserRepository userRepository, StaffRepository staffRepository, RoleService roleService, StaffMapper staffMapper) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.roleService = roleService;
        this.staffMapper = staffMapper;
    }

    @Override
    public List<StaffResponseDto> getAllStaffs() {
        List<Account> staffAccounts=accountRepository.findAll()
                .stream()
                .filter(account -> account.hasRole(ERole.STAFF))
                .toList();
        return staffAccounts.stream().map(account -> {
            Staff staff=staffRepository.findByUser(account.getUser()).orElse(null);
            return staffMapper.toResponseDto(account,staff);

        }).toList();
    }

    @Override
    public StaffResponseDto createStaff(StaffRequestDto dto) {
        User user=staffMapper.toUserEntity(dto);
        user=userRepository.save(user);

        Account account=new Account();
        account.setEmail(dto.getEmail());
        account.setPassword("123456");
        account.setActivated(true);
        account.addRole(roleService.getOrCreateRole(ERole.STAFF));
        account.setUser(user);
        account=accountRepository.save(account);

        Staff staff=new Staff();
        staff.setUser(user);
        staff.setPosition(dto.getPosition());
        staff.setApprovedDate(new Date());
        staff=staffRepository.save(staff);


        return staffMapper.toResponseDto(account,staff);

    }

    @Override
    public StaffResponseDto updateStaff(int id, StaffRequestDto dto) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        User user = account.getUser();
        Staff staff = staffRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Staff info not found"));

        // Cập nhật User từ DTO
        staffMapper.updateUserEntity(user, dto);
        userRepository.save(user);

        // Cập nhật email Account
        account.setEmail(dto.getEmail());
        accountRepository.save(account);

        // Cập nhật Staff
        staff.setPosition(dto.getPosition());
        staffRepository.save(staff);

        return staffMapper.toResponseDto(account, staff);
    }

    @Override
    public StaffResponseDto toggleStatus(int id) {

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        account.setActivated(!account.isActivated());
        accountRepository.save(account);

        Staff staff = staffRepository.findByUser(account.getUser()).orElse(null);

        return staffMapper.toResponseDto(account, staff);
    }

    @Override
    public void deleteStaff(int id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.hasRole(ERole.STAFF)) {
            throw new RuntimeException("Account này không phải nhân viên!");
        }

        if (account.hasRole(ERole.ADMIN)) {
            throw new RuntimeException("Không thể xóa user ADMIN!");
        }

        // 1. Xóa role STAFF khỏi account
        account.removeRole(ERole.STAFF);
        accountRepository.save(account);

        // 2. Xóa record staff
        Staff staff = staffRepository.findByUser(account.getUser()).orElse(null);
        if (staff != null) {
            staffRepository.delete(staff);
        }
    }
}
