package com.bookmagasin.controller;

import com.bookmagasin.dto.StaffRequestCreateDTO;
import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Staff;
import com.bookmagasin.entity.StaffRequest;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.enums.RequestStatus;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.StaffRepository;
import com.bookmagasin.repository.StaffRequestRepository;
import com.bookmagasin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StaffRequestController {

    private final StaffRequestRepository staffRequestRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final StaffRepository staffRepository;

    // 1️⃣ User (trang account) gửi yêu cầu đăng kí nhân viên
    @PostMapping("/staff-requests")
    public ResponseEntity<?> createStaffRequest(@RequestBody StaffRequestCreateDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔍 Kiểm tra request gần nhất của user
        StaffRequest lastReq = staffRequestRepository
                .findTopByUserOrderByIdDesc(user)
                .orElse(null);

        if (lastReq != null) {
            // Nếu đang có yêu cầu PENDING thì không cho gửi nữa
            if (lastReq.getStatus() == RequestStatus.PENDING) {
                return ResponseEntity
                        .badRequest()
                        .body("Bạn đã gửi yêu cầu và đang chờ duyệt!");
            }

            // Nếu đã được duyệt thì không cho gửi lại
            if (lastReq.getStatus() == RequestStatus.APPROVED) {
                return ResponseEntity
                        .badRequest()
                        .body("Bạn đã được duyệt nhân viên rồi!");
            }
        }

        // Nếu qua được đoạn trên -> tạo yêu cầu mới
        StaffRequest req = new StaffRequest();
        req.setUser(user);
        req.setPosition(dto.getPosition());
        req.setJoinDate(dto.getJoinDate());
        req.setStatus(RequestStatus.PENDING);

        staffRequestRepository.save(req);
        return ResponseEntity.ok("Created");
    }

    // 2️⃣ Admin lấy danh sách yêu cầu (Manage Staffs -> Xem yêu cầu)
    @GetMapping("/admin/staff-requests")
    public List<StaffRequest> getStaffRequests(
            @RequestParam(required = false) String status) {

        if (status == null || status.isBlank()) {
            return staffRequestRepository.findAll();
        }

        RequestStatus st = RequestStatus.valueOf(status.toUpperCase());
        return staffRequestRepository.findByStatus(st);
    }

    // 3️⃣ Admin DUYỆT yêu cầu
    @PutMapping("/admin/staff-requests/{id}/approve")
    public ResponseEntity<?> approveStaffRequest(@PathVariable Integer id) {
        StaffRequest req = staffRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff request not found"));

        // 3.1. Cập nhật trạng thái yêu cầu hiện tại
        req.setStatus(RequestStatus.APPROVED);
        staffRequestRepository.save(req);

        // 3.2. Lấy user gửi yêu cầu
        User user = req.getUser();

        // 3.3. ĐỔI ROLE TỪ CUSTOMER → STAFF TRONG BẢNG ACCOUNT
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found for user"));

        account.setRole(ERole.STAFF);
        accountRepository.save(account);

        // 3.4. LƯU THÔNG TIN CHỨC VỤ & NGÀY THAM GIA VÀO BẢNG staff
        // Nếu user này chưa có bản ghi staff -> tạo mới, ngược lại thì update
        Staff staff = staffRepository.findByUser(user).orElse(null);
        if (staff == null) {
            staff = new Staff();
            staff.setUser(user);
        }

        staff.setPosition(req.getPosition());
        staff.setHireDate(req.getJoinDate());
        staffRepository.save(staff);

        // 3.5. Tự động REJECT các request PENDING khác của cùng user (nếu có)
        List<StaffRequest> pendings = staffRequestRepository
                .findByUserAndStatus(user, RequestStatus.PENDING);

        for (StaffRequest r : pendings) {
            if (!r.getId().equals(req.getId())) {
                r.setStatus(RequestStatus.REJECTED);
                staffRequestRepository.save(r);
            }
        }

        return ResponseEntity.ok("Approved");
    }

    // 4️⃣ Admin TỪ CHỐI yêu cầu
    @PutMapping("/admin/staff-requests/{id}/reject")
    public ResponseEntity<?> rejectStaffRequest(@PathVariable Integer id) {
        StaffRequest req = staffRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff request not found"));

        req.setStatus(RequestStatus.REJECTED);
        staffRequestRepository.save(req);

        return ResponseEntity.ok("Rejected");
    }
}
