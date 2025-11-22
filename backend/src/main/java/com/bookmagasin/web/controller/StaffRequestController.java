package com.bookmagasin.web.controller;

import com.bookmagasin.service.StaffRequestService;
import com.bookmagasin.web.dto.StaffRegisterDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StaffRequestController {

    private final StaffRequestService staffRequestService;

    // User tự đăng ký làm nhân viên
    @PostMapping("/staff-requests")
    public ResponseEntity<?> registerStaff(@RequestBody StaffRegisterDto dto) {
        try {
            String result = staffRequestService.registerStaff(dto);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // User kiểm tra trạng thái đăng ký nhân viên của mình
    @GetMapping("/staff-requests/status/{userId}")
    public ResponseEntity<?> getStaffStatusByUserId(@PathVariable Integer userId) {
        try {
            Map<String, Object> response = staffRequestService.getStaffStatusByUserId(userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // Admin lấy danh sách yêu cầu đăng ký nhân viên
    @GetMapping("/admin/staff-requests")
    public ResponseEntity<?> getStaffRequests(@RequestParam(required = false) String status) {
        try {
            List<Map<String, Object>> requests = staffRequestService.getStaffRequests(status);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // Admin duyệt yêu cầu đăng ký nhân viên
    @PutMapping("/admin/staff-requests/{id}/approve")
    public ResponseEntity<?> approveStaffRequest(@PathVariable Integer id) {
        try {
            String result = staffRequestService.approveStaffRequest(id);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // Admin từ chối yêu cầu đăng ký nhân viên
    @PutMapping("/admin/staff-requests/{id}/reject")
    public ResponseEntity<?> rejectStaffRequest(@PathVariable Integer id) {
        try {
            String result = staffRequestService.rejectStaffRequest(id);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // Admin toggle lock/unlock nhân viên (từ staffId)
    @PutMapping("/admin/staff-requests/{staffId}/toggle")
    public ResponseEntity<?> toggleStaffStatus(@PathVariable Integer staffId) {
        try {
            Map<String, Object> response = staffRequestService.toggleStaffStatus(staffId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // Admin xóa nhân viên (xóa record trong staff và remove role STAFF)
    @DeleteMapping("/admin/staff-requests/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Integer id) {
        try {
            String result = staffRequestService.deleteStaff(id);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }
}

