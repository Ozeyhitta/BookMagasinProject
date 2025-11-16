package com.bookmagasin.web.controller;

import com.bookmagasin.service.OrderStatusHistoryService;
import com.bookmagasin.web.dto.OrderStatusHistoryDto;
import com.bookmagasin.web.dtoResponse.OrderStatusHistoryResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-status-histories")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderStatusHistoryController {

    private final OrderStatusHistoryService historyService;

    public OrderStatusHistoryController(OrderStatusHistoryService historyService) {
        this.historyService = historyService;
        System.out.println("✅ OrderStatusHistoryController initialized");
    }

    // 🔵 Lấy tất cả order status history
    @GetMapping
    public ResponseEntity<List<OrderStatusHistoryResponseDto>> getAllHistories() {
        System.out.println("📥 GET /api/order-status-histories called");
        try {
            List<OrderStatusHistoryResponseDto> histories = historyService.findAll();
            System.out.println("✅ Found " + histories.size() + " order status histories");
            return ResponseEntity.ok(histories);
        } catch (Exception e) {
            System.err.println("❌ Error in getAllHistories: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🔵 Lấy order status history theo ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderStatusHistoryResponseDto> getHistoryById(@PathVariable Integer id) {
        return historyService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔵 Lấy order status history theo Order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderStatusHistoryResponseDto>> getHistoriesByOrderId(@PathVariable Integer orderId) {
        List<OrderStatusHistoryResponseDto> histories = historyService.findByOrderId(orderId);
        return ResponseEntity.ok(histories);
    }

    // 🟢 Tạo order status history mới
    @PostMapping
    public ResponseEntity<OrderStatusHistoryResponseDto> createHistory(@RequestBody OrderStatusHistoryDto dto) {
        OrderStatusHistoryResponseDto created = historyService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 🔴 Cập nhật order status history
    @PutMapping("/{id}")
    public ResponseEntity<OrderStatusHistoryResponseDto> updateHistory(
            @PathVariable Integer id, 
            @RequestBody OrderStatusHistoryDto dto) {
        try {
            OrderStatusHistoryResponseDto updated = historyService.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ⚫ Xóa order status history
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Integer id) {
        try {
            historyService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

