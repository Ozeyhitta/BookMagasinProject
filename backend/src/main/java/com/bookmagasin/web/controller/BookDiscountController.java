package com.bookmagasin.web.controller;

import com.bookmagasin.service.BookDiscountService;
import com.bookmagasin.web.dto.BookDiscountDto;
import com.bookmagasin.web.dtoResponse.BookDiscountResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/book-discounts")
@CrossOrigin(origins = "http://localhost:3000")
public class BookDiscountController {

    private final BookDiscountService discountService;

    public BookDiscountController(BookDiscountService discountService) {
        this.discountService = discountService;
    }

    // 🔵 Lấy tất cả discount
    @GetMapping
    public ResponseEntity<List<BookDiscountResponseDto>> getAllDiscounts() {
        List<BookDiscountResponseDto> discounts = discountService.findAll();
        return ResponseEntity.ok(discounts);
    }

    // 🔵 Lấy discount theo ID
    @GetMapping("/{id}")
    public ResponseEntity<BookDiscountResponseDto> getDiscountById(@PathVariable Integer id) {
        return discountService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔵 Lấy discount theo Book ID
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BookDiscountResponseDto>> getDiscountsByBookId(@PathVariable Integer bookId) {
        List<BookDiscountResponseDto> discounts = discountService.findByBookId(bookId);
        return ResponseEntity.ok(discounts);
    }

    // 🟢 Tạo discount mới
    @PostMapping
    public ResponseEntity<BookDiscountResponseDto> createDiscount(@RequestBody BookDiscountDto dto) {
        BookDiscountResponseDto created = discountService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 🔴 Cập nhật discount
    @PutMapping("/{id}")
    public ResponseEntity<BookDiscountResponseDto> updateDiscount(
            @PathVariable Integer id, 
            @RequestBody BookDiscountDto dto) {
        try {
            BookDiscountResponseDto updated = discountService.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ⚫ Xóa discount
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Integer id) {
        try {
            discountService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

