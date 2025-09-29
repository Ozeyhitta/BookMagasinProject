package com.bookmagasin.service;

import com.bookmagasin.entity.Service;
import com.bookmagasin.web.dto.ServiceDto;
import com.bookmagasin.web.dtoResponse.ServiceResponseDto;

import java.util.List;
import java.util.Optional;

public interface ServiceService {
    ServiceResponseDto createService(ServiceDto dto);
    List<ServiceResponseDto> getAllServices();
    Optional<ServiceResponseDto> getServiceById(Integer id);
    ServiceResponseDto updateService(Integer id, ServiceDto dto);
    void deleteService(Integer id);
}
