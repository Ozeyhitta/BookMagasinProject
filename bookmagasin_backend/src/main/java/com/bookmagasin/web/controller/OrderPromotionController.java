package com.bookmagasin.web.controller;

import com.bookmagasin.service.OrderPromotionService;
import com.bookmagasin.web.dto.OrderPromotionDto;
import com.bookmagasin.web.dtoResponse.OrderPromotionResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-promotions")
public class OrderPromotionController {

    private final OrderPromotionService orderPromotionService;

    public OrderPromotionController(OrderPromotionService orderPromotionService) {
        this.orderPromotionService = orderPromotionService;
    }

    @PostMapping
    public ResponseEntity<OrderPromotionResponseDto> create(@RequestBody OrderPromotionDto dto) {
        return new ResponseEntity<>(orderPromotionService.create(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderPromotionResponseDto>> getAll() {
        return ResponseEntity.ok(orderPromotionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderPromotionResponseDto> getById(@PathVariable int id) {
        return orderPromotionService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderPromotionResponseDto> update(@PathVariable int id,
                                                            @RequestBody OrderPromotionDto dto) {
        try {
            return ResponseEntity.ok(orderPromotionService.update(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        orderPromotionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
