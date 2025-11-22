package com.bookmagasin.service;

import com.bookmagasin.dto.StaffListDTO;
import com.bookmagasin.entity.Account;
import com.bookmagasin.web.dto.StaffRequestDto;
import com.bookmagasin.web.dtoResponse.StaffResponseDto;

import java.util.List;

public interface StaffService {

    // Danh sách nhân viên
    List<StaffResponseDto> getAllStaffs();

    // Tạo nhân viên mới
    StaffResponseDto createStaff(StaffRequestDto dto);

    // Cập nhật nhân viên
    StaffResponseDto updateStaff(int id, StaffRequestDto dto);

    // Toggle khóa/mở
    StaffResponseDto toggleStatus(int id);

    // Xóa nhân viên
    void deleteStaff(int id);
}


