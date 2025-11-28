package com.bookmagasin.web.controller;

import com.bookmagasin.service.SupportRequestService;
import com.bookmagasin.web.dto.SupportRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SupportRequestController {

    private final SupportRequestService supportService;

    // anonymous users or logged-in users can create support requests
    @PostMapping("/support/requests")
    public ResponseEntity<?> create(@RequestBody SupportRequestDto dto) {
        try {
            Map<String, Object> resp = supportService.createSupportRequest(dto);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // staff/admin list requests
    @GetMapping("/admin/support/requests")
    public ResponseEntity<?> list(@RequestParam(required = false) String status) {
        try {
            List<Map<String, Object>> out = supportService.listSupportRequests(status);
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // staff replies and an email will be sent to the user
    @PutMapping("/admin/support/requests/{id}/reply")
    public ResponseEntity<?> reply(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            String response = body.get("response");
            Integer staffId = null;
            String staffName = body.get("staffName");
            if (body.containsKey("staffId")) {
                try { staffId = Integer.parseInt(body.get("staffId")); } catch (Exception ignored) {}
            }
            Map<String, Object> out = supportService.replyToRequest(id, response, staffId, staffName);
            return ResponseEntity.ok(out);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

}
