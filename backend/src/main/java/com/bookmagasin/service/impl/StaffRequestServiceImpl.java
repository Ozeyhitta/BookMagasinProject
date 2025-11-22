package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Account;
import com.bookmagasin.entity.Role;
import com.bookmagasin.entity.Staff;
import com.bookmagasin.entity.User;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.enums.RequestStatus;
import com.bookmagasin.repository.AccountRepository;
import com.bookmagasin.repository.StaffRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.RoleService;
import com.bookmagasin.service.StaffRequestService;
import com.bookmagasin.web.dto.StaffRegisterDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffRequestServiceImpl implements StaffRequestService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final RoleService roleService;
    private final StaffRepository staffRepository;
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    public String registerStaff(StaffRegisterDto dto) {
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
                throw new RuntimeException("Bạn đã là nhân viên rồi!");
            }
            // Nếu có record với status PENDING -> đang chờ duyệt
            if (existingStaff.getStatus() == RequestStatus.PENDING) {
                throw new RuntimeException("Bạn đã gửi yêu cầu đăng ký nhân viên và đang chờ duyệt!");
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

        Role staffRole=roleService.getOrCreateRole(ERole.STAFF);
        account.addRole(staffRole);
        accountRepository.save(account);

        return "Gửi yêu cầu đăng ký làm nhân viên thành công! Vui lòng chờ admin duyệt.";
    }

    @Override
    public Map<String, Object> getStaffStatusByUserId(Integer userId) {
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

        return response;
    }

    @Override
    public List<Map<String, Object>> getStaffRequests(String status) {
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
        
        return allStaffs.stream()
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
    }

    @Override
    public String approveStaffRequest(Integer id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff request not found"));

        User user = staff.getUser();
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found for user"));

        // Cập nhật status và approvedDate
        staff.setStatus(RequestStatus.APPROVED);
        staff.setApprovedDate(new Date());
        staffRepository.save(staff);

        // Thêm role STAFF cho account
        account.addRole(roleService.getOrCreateRole(ERole.STAFF));
        accountRepository.save(account);

        return "Đã duyệt yêu cầu đăng ký nhân viên!";
    }

    @Override
    public String rejectStaffRequest(Integer id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff request not found"));

        User user=staff.getUser();

        Account account=accountRepository.findByUser(user)
                .orElseThrow(()->new RuntimeException("Account not found for user"));

        staff.setStatus(RequestStatus.REJECTED);
        staffRepository.save(staff);

        if(account.hasRole(ERole.STAFF)){
            account.removeRole(ERole.STAFF);
            accountRepository.save(account);
        }
        staffRepository.delete(staff);

        return "Đã từ chối yêu cầu và gỡ role STAFF khỏi tài khoản!";
    }

    @Override
    public Map<String, Object> toggleStaffStatus(Integer staffId) {
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
        
        return response;
    }

    @Override
    public String deleteStaff(Integer id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        User user = staff.getUser();
        if (user == null) {
            throw new RuntimeException("User not found for staff");
        }

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found for user"));
        if(account.hasRole(ERole.ADMIN)){
            throw new RuntimeException("Không thể xóa nhân viên là ADMIN!");

        }

        if(account.hasRole(ERole.STAFF)){
            account.removeRole(ERole.STAFF);
            accountRepository.save(account);
        }
        // Xóa record trong bảng staff
        staffRepository.delete(staff);

        //set trang thai account true
        account.setActivated(true);
        accountRepository.save(account);


        return "Đã xóa nhân viên thành công!";
    }
}

