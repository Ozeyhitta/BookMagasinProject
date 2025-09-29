package com.bookmagasin.service.impl;

import com.bookmagasin.repository.ServiceRepository;
import com.bookmagasin.service.ServiceService;
import com.bookmagasin.web.dto.ServiceDto;
import com.bookmagasin.web.dtoResponse.ServiceResponseDto;
import com.bookmagasin.web.mapper.ServiceMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceServiceImpl(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Override
    public ServiceResponseDto createService(ServiceDto dto) {
       com.bookmagasin.entity.Service service= ServiceMapper.toEntity(dto);
       return ServiceMapper.toResponseDto(serviceRepository.save(service));
    }

    @Override
    public List<ServiceResponseDto> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(ServiceMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ServiceResponseDto> getServiceById(Integer id) {
        return serviceRepository.findById(id)
                .map(ServiceMapper::toResponseDto);
    }

    @Override
    public ServiceResponseDto updateService(Integer id, ServiceDto dto) {
        com.bookmagasin.entity.Service service=serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        service.setNameService(dto.getNameService());
        service.setPrice(dto.getPrice());
        service.setStatus(dto.getStatus());
        return ServiceMapper.toResponseDto(serviceRepository.save(service));
    }

    @Override
    public void deleteService(Integer id) {
        serviceRepository.deleteById(id);
    }
}
