package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Cart;
import com.bookmagasin.service.CartService;
import com.bookmagasin.web.dto.CartDto;
import com.bookmagasin.web.dtoResponse.CartResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CartResponseDto>> getAllCarts() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartResponseDto> getCartById(@PathVariable int id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<CartResponseDto>> getCartByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(service.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<CartResponseDto> createCart(@RequestBody CartDto dto) {
        CartResponseDto created = service.createCart(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartResponseDto> updateCart(@PathVariable int id, @RequestBody CartDto dto) {
        try {
            CartResponseDto updated = service.updateCart(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable int id) {
        service.deleteCartById(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ NEW: Xóa toàn bộ giỏ hàng của 1 user
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteCartByUserId(@PathVariable int userId) {
        service.deleteCartByUserId(userId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/users/{userId}/count")
    public ResponseEntity<Integer> getCartCount(@PathVariable int userId) {
        int count = service.findByUserId(userId)
                .stream()
                .mapToInt(CartResponseDto::getQuantity)
                .sum();
        return ResponseEntity.ok(count);
    }

}
