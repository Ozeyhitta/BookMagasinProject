package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Staff;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.enums.RequestStatus;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.StaffRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.web.dto.StaffRegisterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class  StaffRequestController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final StaffRepository staffRepository;
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    // User tự đăng ký làm nhân viên
    @PostMapping("/staff-requests")
    public ResponseEntity<?> registerStaff(@RequestBody StaffRegisterDTO dto) {
        try {
            // Tìm user theo userId
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Kiểm tra user đã có account chưa
            Account account = accountRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found for user"));


            // Kiểm tra user đã có yêu cầu đăng ký chưa
            Staff existingStaff = staffRepository.findByUser(user).orElse(null);
            if (existingStaff != null) {
                // Nếu đã có record và có role STAFF -> đã được duyệt rồi
                if (account.hasRole(ERole.STAFF)) {
                    return ResponseEntity.badRequest()
                            .body("Bạn đã là nhân viên rồi!");
                }
                // Nếu có record với status PENDING -> đang chờ duyệt
                if (existingStaff.getStatus() == RequestStatus.PENDING) {
                    return ResponseEntity.badRequest()
                            .body("Bạn đã gửi yêu cầu đăng ký nhân viên và đang chờ duyệt!");
                }
                // Nếu có record với status REJECTED -> có thể gửi lại
                // Xóa record cũ để tạo lại
                staffRepository.delete(existingStaff);
            }

            // Tạo record trong bảng Staff với status PENDING
            Staff staff = new Staff();
            staff.setUser(user);
            staff.setPosition(dto.getPosition());
            staff.setStatus(RequestStatus.PENDING);
            staff.setRequestDate(new Date()); // Ngày gửi yêu cầu
            staffRepository.save(staff);



            return ResponseEntity.ok("Gửi yêu cầu đăng ký làm nhân viên thành công! Vui lòng chờ admin duyệt.");
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
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Account account = accountRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            Staff staff = staffRepository.findByUser(user).orElse(null);

            Map<String, Object> response = new HashMap<>();
            
            if (staff == null) {
                // Không có record trong staff
                response.put("hasStaffRecord", false);
                response.put("hasStaffRole", account.hasRole(ERole.STAFF));
                response.put("status", null);
                response.put("isActivated", account.isActivated());
                response.put("isApproved", false);
            } else {
                // Có record trong staff
                response.put("hasStaffRecord", true);
                response.put("hasStaffRole", account.hasRole(ERole.STAFF));
                response.put("status", staff.getStatus() != null ? staff.getStatus().name() : null);
                response.put("isActivated", account.isActivated());
                // isApproved = true chỉ khi: status APPROVED, có role STAFF, VÀ account đang activated
                boolean isApproved = staff.getStatus() == RequestStatus.APPROVED 
                    && account.hasRole(ERole.STAFF) 
                    && account.isActivated();
                response.put("isApproved", isApproved);
            }

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
            // Lấy tất cả staff
            List<Staff> allStaffs = staffRepository.findAll();
            
            // Filter theo status (nếu có) hoặc lấy tất cả PENDING
            RequestStatus filterStatus = null;
            if (status != null && !status.isEmpty()) {
                try {
                    filterStatus = RequestStatus.valueOf(status.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Nếu status không hợp lệ, mặc định lấy PENDING
                    filterStatus = RequestStatus.PENDING;
                }
            } else {
                filterStatus = RequestStatus.PENDING; // Mặc định lấy PENDING
            }
            
            final RequestStatus finalFilterStatus = filterStatus;
            
            List<Map<String, Object>> requests = allStaffs.stream()
                    .filter(staff -> {
                        // Lọc theo status
                        if (staff.getStatus() == null) {
                            return false;
                        }
                        if (finalFilterStatus != null && staff.getStatus() != finalFilterStatus) {
                            return false;
                        }
                        // Đảm bảo account tồn tại
                        Account acc = accountRepository.findByUser(staff.getUser()).orElse(null);
                        return acc != null;
                    })
                    .map(staff -> {
                        User user = staff.getUser();
                        Account acc = accountRepository.findByUser(user).orElse(null);
                        Map<String, Object> req = new HashMap<>();
                        req.put("id", staff.getId());
                        req.put("status", staff.getStatus() != null ? staff.getStatus().name() : "PENDING");
                        req.put("position", staff.getPosition());
                        req.put("joinDate", staff.getApprovedDate() != null ? sdf.format(staff.getApprovedDate()) : null);
                        req.put("requestDate", staff.getRequestDate() != null ? staff.getRequestDate().toString() : null);
                        req.put("activated", acc != null ? acc.isActivated() : true); // Thêm trạng thái activated từ Account
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("fullName", user.getFullName() != null ? user.getFullName() : "");
                        userMap.put("email", acc != null ? acc.getEmail() : "");
                        userMap.put("phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
                        req.put("user", userMap);
                        return req;
                    })
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // Admin duyệt yêu cầu đăng ký nhân viên
    @PutMapping("/admin/staff-requests/{id}/approve")
    public ResponseEntity<?> approveStaffRequest(@PathVariable Integer id) {
        try {
            Staff staff = staffRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Staff request not found"));

            User user = staff.getUser();
            Account account = accountRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found for user"));

            // Cập nhật status và approvedDate
            staff.setStatus(RequestStatus.APPROVED);
            staff.setApprovedDate(new Date());
            staffRepository.save(staff);

            // Set role STAFF cho account
            account.setRole(ERole.STAFF);
            accountRepository.save(account);

            return ResponseEntity.ok("Đã duyệt yêu cầu đăng ký nhân viên!");
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
            Staff staff = staffRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Staff request not found"));

            // Cập nhật status thành REJECTED thay vì xóa record
            staff.setStatus(RequestStatus.REJECTED);
            staffRepository.save(staff);

            return ResponseEntity.ok("Đã từ chối yêu cầu đăng ký nhân viên!");
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
            Staff staff = staffRepository.findById(staffId)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            User user = staff.getUser();
            Account account = accountRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found for user"));

            // Toggle activated status
            account.setActivated(!account.isActivated());
            Account savedAccount = accountRepository.save(account);

            // Trả về Account object để frontend cập nhật state (giống ManageCustomers)
            Map<String, Object> response = new HashMap<>();
            response.put("activated", savedAccount.isActivated());
            response.put("id", savedAccount.getId());
            
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
            Staff staff = staffRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            User user = staff.getUser();
            Account account = accountRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found for user"));

            // Xóa role STAFF khỏi account
            if (account.getRole() == ERole.STAFF) {
                account.setRole(ERole.CUSTOMER);
                accountRepository.save(account);
            }

            // Xóa record trong bảng staff
            staffRepository.delete(staff);

            return ResponseEntity.ok("Đã xóa nhân viên thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }
}

