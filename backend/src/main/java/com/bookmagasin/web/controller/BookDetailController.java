package com.bookmagasin.web.controller;

import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.service.BookDetailService;
import com.bookmagasin.web.dto.BookDetailDto;
import com.bookmagasin.web.dtoResponse.BookDetailResponseDto;
import com.bookmagasin.web.dtoResponse.BookResponseDto;
import org.springframework.http.HttpStatus;
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


    @GetMapping
    public List<BookDetailResponseDto> getAll() {
            return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDetailResponseDto> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🟢 Create
    @PostMapping
    public ResponseEntity<BookDetailResponseDto> create(@RequestBody BookDetailDto dto) {
        BookDetailResponseDto created=service.save(dto);
        return new ResponseEntity<>(created,HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<BookDetailResponseDto> update(@PathVariable Integer id, @RequestBody BookDetailDto dto) {
        try {
            return ResponseEntity.ok(service.update(id,dto));

        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteById(id);
       return ResponseEntity.noContent().build();
    }
}
