package com.bookmagasin.web.controller;

import com.bookmagasin.dto.StaffListDTO;
import com.bookmagasin.entity.Account;
import com.bookmagasin.service.StaffService;
import com.bookmagasin.web.dto.StaffRequestDto;
import com.bookmagasin.web.dtoResponse.StaffResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staffs")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<List<StaffResponseDto>> getAllStaffs() {
        return ResponseEntity.ok(staffService.getAllStaffs());
    }


    @PostMapping
    public ResponseEntity<StaffResponseDto> createStaff(@RequestBody StaffRequestDto dto) {
        StaffResponseDto response = staffService.createStaff(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponseDto> updateStaff(
            @PathVariable int id,
            @RequestBody StaffRequestDto dto
    ) {
        StaffResponseDto response = staffService.updateStaff(id, dto);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{id}/toggle")
    public ResponseEntity<StaffResponseDto> toggleStatus(@PathVariable int id) {
        StaffResponseDto response = staffService.toggleStatus(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStaff(@PathVariable int id) {

        staffService.deleteStaff(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Xóa nhân viên thành công!");
        response.put("accountId", String.valueOf(id));

        return ResponseEntity.ok(response);
    }
}
