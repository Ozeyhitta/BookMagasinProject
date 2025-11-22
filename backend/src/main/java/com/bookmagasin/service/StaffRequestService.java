package com.bookmagasin.service;

import com.bookmagasin.web.dto.StaffRegisterDto;

import java.util.List;
import java.util.Map;

public interface StaffRequestService {
    String registerStaff(StaffRegisterDto dto);
    Map<String, Object> getStaffStatusByUserId(Integer userId);
    List<Map<String, Object>> getStaffRequests(String status);
    String approveStaffRequest(Integer id);
    String rejectStaffRequest(Integer id);
    Map<String, Object> toggleStaffStatus(Integer staffId);
    String deleteStaff(Integer id);
}

