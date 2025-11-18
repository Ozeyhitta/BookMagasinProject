package com.bookmagasin.service;

import com.bookmagasin.dto.StaffListDTO;
import com.bookmagasin.entity.Account;
import com.bookmagasin.web.dto.StaffRequestDTO;

import java.util.List;

public interface StaffService {
    List<StaffListDTO> getAllStaffs();
    Account createStaff(StaffRequestDTO dto);
    Account updateStaff(int id, StaffRequestDTO dto);
    Account toggleStatus(int id);
    void deleteStaff(int id);
}

