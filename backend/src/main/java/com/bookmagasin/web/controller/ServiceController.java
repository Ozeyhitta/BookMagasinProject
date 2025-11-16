package com.bookmagasin.web.controller;

import com.bookmagasin.service.ServiceService;
import com.bookmagasin.web.dto.ServiceDto;
import com.bookmagasin.web.dtoResponse.ServiceResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceController {
    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<ServiceResponseDto> createService(@RequestBody ServiceDto dto) {
        ServiceResponseDto created = serviceService.createService(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<ServiceResponseDto>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponseDto> getServiceById(@PathVariable Integer id) {
        return serviceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponseDto> updateService(@PathVariable Integer id,
                                                            @RequestBody ServiceDto dto) {
        try {
            ServiceResponseDto updated = serviceService.updateService(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Integer id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
