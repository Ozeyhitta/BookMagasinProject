package com.bookmagasin.web.controller;

import com.bookmagasin.service.RegisteredCustomerService;
import com.bookmagasin.web.dto.RegisteredCustomerDto;
import com.bookmagasin.web.dtoResponse.RegisteredCustomerResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class RegisteredCustomerController {

    private final RegisteredCustomerService customerService;

    public RegisteredCustomerController(RegisteredCustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<RegisteredCustomerResponseDto> create(@RequestBody RegisteredCustomerDto dto) {
        return new ResponseEntity<>(customerService.create(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RegisteredCustomerResponseDto>> getAll() {
        return ResponseEntity.ok(customerService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegisteredCustomerResponseDto> getById(@PathVariable int id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegisteredCustomerResponseDto> update(@PathVariable int id,
                                                                @RequestBody RegisteredCustomerDto dto) {
        return ResponseEntity.ok(customerService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

