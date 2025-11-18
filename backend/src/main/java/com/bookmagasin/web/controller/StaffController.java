package com.bookmagasin.web.controller;

import com.bookmagasin.dto.StaffListDTO;
import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Staff;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.StaffRepository;
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

    @Autowired
    private StaffRepository staffRepo;   // ⚠ nhớ tạo StaffRepository

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
    public List<StaffListDTO> getAllStaffs() {

        List<Account> staffAccounts = accountRepo.findAll()
                .stream()
                .filter(acc -> acc.getRole() == ERole.STAFF)
                .collect(Collectors.toList());

        return staffAccounts.stream().map(acc -> {
            User user = acc.getUser();
            Staff staff = staffRepo.findByUser(user).orElse(null);

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
                dto.setJoinDate(
                        staff.getHireDate() != null ? sdf.format(staff.getHireDate()) : null
                );
            }

            return dto;
        }).collect(Collectors.toList());
    }

    // ============================
    // 2) Tạo nhân viên mới (giống cũ)
    // ============================
    @PostMapping
    public Account createStaff(@RequestBody StaffRequestDTO dto) {

        User user = new User();
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setDateOfBirth(parseDate(dto.getDateOfBirth()));
        user.setAddress(dto.getAddress());
        user.setAvatarUrl(dto.getAvatarUrl());
        user = userRepo.save(user);

        Account acc = new Account();
        acc.setEmail(dto.getEmail());
        acc.setPassword("123456");          // TODO: mã hoá & cho đổi sau
        acc.setRole(ERole.STAFF);
        acc.setActivated(true);
        acc.setUser(user);

        return accountRepo.save(acc);
    }

    // ============================
    // 3) Cập nhật nhân viên (giữ nguyên)
    // ============================
    @PutMapping("/{id}")
    public Account updateStaff(@PathVariable int id, @RequestBody StaffRequestDTO dto) {
        Account acc = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        User user = acc.getUser();
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setDateOfBirth(parseDate(dto.getDateOfBirth()));
        user.setAddress(dto.getAddress());
        user.setAvatarUrl(dto.getAvatarUrl());
        userRepo.save(user);

        acc.setEmail(dto.getEmail());
        return accountRepo.save(acc);
    }

    // ============================
    // 4) Toggle trạng thái (giữ nguyên)
    // ============================
    @PutMapping("/{id}/toggle")
    public Account toggleStatus(@PathVariable int id) {
        Account acc = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        acc.setActivated(!acc.isActivated());
        return accountRepo.save(acc);
    }

    // ============================
    // 5) Xóa nhân viên (giữ nguyên)
    // ============================
    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable int id) {
        accountRepo.deleteById(id);
    }
}
