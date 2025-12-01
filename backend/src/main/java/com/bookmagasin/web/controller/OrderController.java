package com.bookmagasin.web.controller;

import com.bookmagasin.service.OrderService;
import com.bookmagasin.service.ReturnRequestService;
import com.bookmagasin.web.dto.MultiReturnRequestDto;
import com.bookmagasin.web.dto.OrderDto;
import com.bookmagasin.web.dtoResponse.OrderResponseDto;
import com.bookmagasin.web.dtoResponse.ReturnRequestResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000") // cho phép React frontend truy cập
public class OrderController {
    private final OrderService orderService;
    private final ReturnRequestService returnRequestService;

    public OrderController(OrderService orderService, ReturnRequestService returnRequestService) {
        this.orderService = orderService;
        this.returnRequestService = returnRequestService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderDto dto){
        try {
            OrderResponseDto created=orderService.createOrder(dto);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
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

    @GetMapping("/manage")
    public ResponseEntity<List<OrderResponseDto>> searchOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, name = "payment") String paymentMethod,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(required = false, defaultValue = "latest") String sort) {
        List<OrderResponseDto> result = orderService.searchOrders(status, paymentMethod, query, sort);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<OrderResponseDto> getOrderDetail(@PathVariable Integer id) {
        return orderService.getDetailedOrder(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
    // RETURN BOOK REQUEST – Tạo yêu cầu trả sách (thay vì return trực tiếp)
    @PutMapping("/{orderId}/return")
    public ResponseEntity<?> createReturnRequest(
            @PathVariable Integer orderId,
            @RequestParam Integer orderItemId,
            @RequestParam Integer quantity,
            @RequestBody(required = false) Map<String, String> body
    ) {
        try {
            String reason = body != null ? body.get("reason") : null;
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Lý do trả hàng là bắt buộc");
            }

            ReturnRequestResponseDto returnRequest = returnRequestService.createReturnRequest(
                    orderId, orderItemId, quantity, reason.trim()
            );
            return ResponseEntity.ok(returnRequest);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // MULTI-RETURN BOOK REQUEST – Tạo yêu cầu trả nhiều sách cùng lúc
    @PutMapping("/{orderId}/return-multi")
    public ResponseEntity<?> createMultiReturnRequest(
            @PathVariable Integer orderId,
            @RequestBody MultiReturnRequestDto request
    ) {
        try {
            if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body("Phải chọn ít nhất một sản phẩm để trả");
            }

            String reason = request.getReason();
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Lý do trả hàng là bắt buộc");
            }

            List<ReturnRequestResponseDto> returnRequests = returnRequestService.createMultiReturnRequest(
                    orderId, request.getItems(), reason.trim()
            );
            return ResponseEntity.ok(returnRequests);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


}
