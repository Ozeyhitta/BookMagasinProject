package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.web.dto.StaffRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/staffs")
public class StaffController {

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private UserRepository userRepo;

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    private Date parseDate(String str) {
        try {
            return (str == null || str.isEmpty()) ? null : sdf.parse(str);
        } catch (Exception e) {
            return null;
        }
    }

    // ============================
    // 1) Lấy danh sách nhân viên
    // ============================
    @GetMapping
    public List<Account> getAllStaffs() {
        return accountRepo.findAll()
                .stream()
                .filter(acc -> acc.getRole() == ERole.STAFF)
                .collect(Collectors.toList());
    }

    // ============================
    // 2) Tạo nhân viên mới
    // ============================
    @PostMapping
    public Account createStaff(@RequestBody StaffRequestDTO dto) {

        User user = new User();
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPosition(dto.getPosition());

        user.setJoinDate(parseDate(dto.getJoinDate()));
        user.setDateOfBirth(parseDate(dto.getDateOfBirth()));

        user.setAddress(dto.getAddress());
        user.setAvatarUrl(dto.getAvatarUrl());

        user = userRepo.save(user);

        Account acc = new Account();
        acc.setEmail(dto.getEmail());
        acc.setPassword("123456");
        acc.setRole(ERole.STAFF);
        acc.setActivated(true);
        acc.setUser(user);

        return accountRepo.save(acc);
    }

    // ============================
    // 3) Cập nhật nhân viên
    // ============================
    @PutMapping("/{id}")
    public Account updateStaff(@PathVariable int id, @RequestBody StaffRequestDTO dto) {
        Account acc = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        User user = acc.getUser();

        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPosition(dto.getPosition());

        user.setJoinDate(parseDate(dto.getJoinDate()));
        user.setDateOfBirth(parseDate(dto.getDateOfBirth()));

        user.setAddress(dto.getAddress());
        user.setAvatarUrl(dto.getAvatarUrl());

        userRepo.save(user);

        acc.setEmail(dto.getEmail());
        return accountRepo.save(acc);
    }

    // ============================
    // 4) Toggle trạng thái
    // ============================
    @PutMapping("/{id}/toggle")
    public Account toggleStatus(@PathVariable int id) {
        Account acc = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        acc.setActivated(!acc.isActivated());
        return accountRepo.save(acc);
    }

    // ============================
    // 5) Xóa nhân viên
    // ============================
    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable int id) {
        accountRepo.deleteById(id);
    }
}
