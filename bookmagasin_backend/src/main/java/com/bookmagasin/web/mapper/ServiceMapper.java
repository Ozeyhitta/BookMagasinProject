package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Service;
import com.bookmagasin.web.dto.ServiceDto;
import com.bookmagasin.web.dtoResponse.ServiceResponseDto;

public class ServiceMapper {

    public static ServiceResponseDto toResponseDto(Service service) {
        return new ServiceResponseDto(
                service.getId(),
                service.getNameService(),
                service.getPrice(),
                service.getStatus()
        );
    }

    public static Service toEntity(ServiceDto dto) {
        Service service = new Service();
        service.setNameService(dto.getNameService());
        service.setPrice(dto.getPrice());
        service.setStatus(dto.getStatus());
        return service;
    }
}

