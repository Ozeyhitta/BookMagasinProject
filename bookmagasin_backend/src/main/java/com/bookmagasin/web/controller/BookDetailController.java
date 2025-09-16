package com.bookmagasin.web.controller;

import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.service.BookDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.bind.annotation.*;


import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books-details")
public class BookDetailController {

    private final BookDetailService service;

    public BookDetailController(BookDetailService service) {
        this.service = service;
    }

    // 🔵 Read all
    @GetMapping
    public List<BookDetail> getAll() {
        return service.findAll();
    }

    // 🔵 Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookDetail> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🟢 Create
    @PostMapping
    public BookDetail create(@RequestBody BookDetail bookDetail) {
        return service.save(bookDetail);
    }

    // 🔴 Update
    @PutMapping("/{id}")
    public ResponseEntity<BookDetail> update(@PathVariable Integer id, @RequestBody BookDetail bookDetail) {
        return service.findById(id)
                .map(existing -> {
                    bookDetail.setId(id); // giữ ID cũ
                    return ResponseEntity.ok(service.save(bookDetail));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @PatchMapping("/{id}")
    public ResponseEntity<BookDetail> patchBookDetail(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> updates) {

        return service.findById(id).map(existing -> {
            updates.forEach((field, value) -> {
                Field f = ReflectionUtils.findField(BookDetail.class, field);
                if (f != null) {
                    f.setAccessible(true);
                    ReflectionUtils.setField(f, existing, value);
                }
            });
            return ResponseEntity.ok(service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ⚫ Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
