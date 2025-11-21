package com.bookmagasin.service.impl;

import com.bookmagasin.dto.StaffListDTO;
import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Staff;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.StaffRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.StaffService;
import com.bookmagasin.web.dto.StaffRequestDTO;
import com.bookmagasin.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final RoleService roleService;

    private Date parseDate(String str) {
        if (str == null || str.isEmpty()) {
            return null;
        }
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            return sdf.parse(str);
        } catch (Exception e) {
            return null;
        }
    }

    private String formatDate(Date date) {
        if (date == null) {
            return null;
        }
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            return sdf.format(date);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<StaffListDTO> getAllStaffs() {
        List<Account> staffAccounts = accountRepository.findAll()
                .stream()
                .filter(acc -> acc.hasRole(ERole.STAFF))
                .collect(Collectors.toList());

        return staffAccounts.stream().map(acc -> {
            User user = acc.getUser();
            Staff staff = staffRepository.findByUser(user).orElse(null);

            StaffListDTO dto = new StaffListDTO();
            dto.setId(acc.getId());
            dto.setEmail(acc.getEmail());
            dto.setActivated(acc.isActivated());

            if (user != null) {
                dto.setFullName(user.getFullName());
                dto.setPhoneNumber(user.getPhoneNumber());
            }

            if (staff != null) {
                dto.setPosition(staff.getPosition());
                // Lấy ngày duyệt (approvedDate) làm joinDate
                dto.setJoinDate(formatDate(staff.getApprovedDate()));
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public Account createStaff(StaffRequestDTO dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setDateOfBirth(parseDate(dto.getDateOfBirth()));
        user.setAddress(dto.getAddress());
        user.setAvatarUrl(dto.getAvatarUrl());
        user = userRepository.save(user);

        Account acc = new Account();
        acc.setEmail(dto.getEmail());
        acc.setPassword("123456"); // TODO: mã hoá & cho đổi sau
        acc.addRole(roleService.getOrCreateRole(ERole.STAFF));
        acc.setActivated(true);
        acc.setUser(user);

        return accountRepository.save(acc);
    }

    @Override
    public Account updateStaff(int id, StaffRequestDTO dto) {
        Account acc = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        User user = acc.getUser();
        if (user != null) {
            user.setFullName(dto.getFullName());
            user.setPhoneNumber(dto.getPhoneNumber());
            user.setDateOfBirth(parseDate(dto.getDateOfBirth()));
            user.setAddress(dto.getAddress());
            user.setAvatarUrl(dto.getAvatarUrl());
            userRepository.save(user);
        }

        acc.setEmail(dto.getEmail());
        return accountRepository.save(acc);
    }

    @Override
    public Account toggleStatus(int id) {
        Account acc = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        acc.setActivated(!acc.isActivated());
        return accountRepository.save(acc);
    }

    @Override
    public void deleteStaff(int id) {
        accountRepository.deleteById(id);
    }
}

