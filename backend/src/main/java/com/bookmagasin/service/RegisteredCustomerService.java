package com.bookmagasin.service;

import com.bookmagasin.web.dto.RegisteredCustomerDto;
import com.bookmagasin.web.dtoResponse.RegisteredCustomerResponseDto;

import java.util.List;

public interface RegisteredCustomerService {
    RegisteredCustomerResponseDto create(RegisteredCustomerDto dto);
    List<RegisteredCustomerResponseDto> getAll();
    RegisteredCustomerResponseDto getById(int id);
    RegisteredCustomerResponseDto update(int id, RegisteredCustomerDto dto);
    void delete(int id);
}

