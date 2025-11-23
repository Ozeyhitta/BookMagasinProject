package com.bookmagasin.web.controller;

import com.bookmagasin.service.ReturnRequestService;
import com.bookmagasin.web.dtoResponse.ReturnRequestResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/return-requests")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ReturnRequestController {

    private final ReturnRequestService returnRequestService;

    // Tạo return request (customer)
    @PostMapping
    public ResponseEntity<?> createReturnRequest(@RequestBody Map<String, Object> request) {
        try {
            Integer orderId = (Integer) request.get("orderId");
            Integer orderItemId = (Integer) request.get("orderItemId");
            Integer quantity = (Integer) request.get("quantity");
            String reason = (String) request.get("reason");

            if (orderId == null || orderItemId == null || quantity == null || reason == null) {
                return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc");
            }

            ReturnRequestResponseDto created = returnRequestService.createReturnRequest(orderId, orderItemId, quantity, reason);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
        }
    }

    // Lấy tất cả return requests (staff/admin)
    @GetMapping
    public ResponseEntity<List<ReturnRequestResponseDto>> getAllReturnRequests(
            @RequestParam(required = false) String status) {
        try {
            List<ReturnRequestResponseDto> requests;
            if (status != null && !status.trim().isEmpty()) {
                requests = returnRequestService.getReturnRequestsByStatus(status);
            } else {
                requests = returnRequestService.getAllReturnRequests();
            }
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy return request theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ReturnRequestResponseDto> getReturnRequestById(@PathVariable Integer id) {
        Optional<ReturnRequestResponseDto> request = returnRequestService.getReturnRequestById(id);
        return request.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Duyệt return request (staff)
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveReturnRequest(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer staffId = request.get("staffId");
            if (staffId == null) {
                return ResponseEntity.badRequest().body("Thiếu staffId");
            }

            ReturnRequestResponseDto approved = returnRequestService.approveReturnRequest(id, staffId);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
        }
    }

    // Từ chối return request (staff)
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectReturnRequest(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> request) {
        try {
            Integer staffId = (Integer) request.get("staffId");
            String rejectionReason = (String) request.get("rejectionReason");

            if (staffId == null) {
                return ResponseEntity.badRequest().body("Thiếu staffId");
            }

            ReturnRequestResponseDto rejected = returnRequestService.rejectReturnRequest(id, staffId, rejectionReason);
            return ResponseEntity.ok(rejected);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
        }
    }


    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<ReturnRequestResponseDto>> getReturnRequestsByOrderId(@PathVariable Integer orderId) {
        try {
            List<ReturnRequestResponseDto> list = returnRequestService.getReturnRequestsByOrderId(orderId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




}

