package com.bookmagasin.web.controller;

import com.bookmagasin.service.OrderItemService;
import com.bookmagasin.web.dto.OrderItemDto;
import com.bookmagasin.web.dtoResponse.OrderItemResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<OrderItemResponseDto> createOrderItem(@RequestBody OrderItemDto dto) {
        return new ResponseEntity<>(orderItemService.createOrderItem(dto), HttpStatus.CREATED);
    }

    // GET ALL OrderItems
    @GetMapping
    public ResponseEntity<List<OrderItemResponseDto>> getAllOrderItems() {
        return ResponseEntity.ok(orderItemService.getAllOrderItems());
    }


    // GET ALL items by ORDER ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItemResponseDto>> getItemsByOrderId(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderItemService.getOrderItemsByOrderId(orderId));
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderItemResponseDto> getOrderItemById(@PathVariable Integer id) {
        return orderItemService.getOrderItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<OrderItemResponseDto> updateOrderItem(@PathVariable Integer id,
                                                                @RequestBody OrderItemDto dto) {
        try {
            return ResponseEntity.ok(orderItemService.updateOrderItem(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Integer id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }
}
