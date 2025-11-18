package com.bookmagasin.web.controller;

import com.bookmagasin.dto.StaffListDTO;
import com.bookmagasin.entity.Account;
import com.bookmagasin.service.StaffService;
import com.bookmagasin.web.dto.StaffRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staffs")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public List<StaffListDTO> getAllStaffs() {
        return staffService.getAllStaffs();
    }

    // ============================
    // 2) Tạo nhân viên mới (giống cũ)
    // ============================
    @PostMapping
    public Account createStaff(@RequestBody StaffRequestDTO dto) {
        return staffService.createStaff(dto);
    }

    // ============================
    // 3) Cập nhật nhân viên (giữ nguyên)
    // ============================
    @PutMapping("/{id}")
    public Account updateStaff(@PathVariable int id, @RequestBody StaffRequestDTO dto) {
        return staffService.updateStaff(id, dto);
    }

    // ============================
    // 4) Toggle trạng thái (giữ nguyên)
    // ============================
    @PutMapping("/{id}/toggle")
    public Account toggleStatus(@PathVariable int id) {
        return staffService.toggleStatus(id);
    }

    // ============================
    // 5) Xóa nhân viên (giữ nguyên)
    // ============================
    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable int id) {
        staffService.deleteStaff(id);
    }
}
