package com.bookmagasin.web.controller;

import com.bookmagasin.service.OrderService;
import com.bookmagasin.web.dto.OrderDto;
import com.bookmagasin.web.dtoResponse.OrderResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000") // cho phép React frontend truy cập
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(@RequestBody OrderDto dto){
        OrderResponseDto created=orderService.createOrder(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    // READ ALL
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDto> getOrderById(@PathVariable Integer id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrderById(id);
        return ResponseEntity.noContent().build();
    }

    // GET ORDERS BY USER ID
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(orderService.findByUserId(userId));
    }

    // UPDATE ORDER STATUS (dùng cho thanh toán)
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable Integer id,
            @RequestBody java.util.Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            OrderResponseDto updated = orderService.updateOrderStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            // IllegalArgumentException (ví dụ: enum value không hợp lệ) → Bad Request
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            // RuntimeException khác (ví dụ: Order not found) → Not Found
            return ResponseEntity.notFound().build();
        }
    }
}
