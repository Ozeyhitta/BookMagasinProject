package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.service.BookService;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dtoResponse.BookResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // 🔵 Lấy toàn bộ sách với thông tin chi tiết (author + bookDetail)
    @GetMapping
    public List<BookResponseDto> getAllBooks() {
        return bookService.findAllWithDetails();
    }

    // 🔵 Lấy sách theo ID với thông tin chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDto> getBookById(@PathVariable Integer id) {
        return bookService.findByIdWithDetails(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🟢 Tạo sách mới (chỉ cần gửi authorId & bookDetailId)
    @PostMapping
    public ResponseEntity<BookDto> createBook(@RequestBody BookDto dto) {
        BookDto created = bookService.createBook(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 🔴 Cập nhật sách theo ID
    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(@PathVariable int id, @RequestBody BookDto dto) {
        try {
            BookDto updated = bookService.updateBook(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ⚫ Xóa sách theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        if (bookService.findById(id).isPresent()) {
            bookService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // 🛠 Cập nhật chi tiết sách (bookDetail) bằng PATCH
    @PatchMapping("/{id}/details")
    public ResponseEntity<BookResponseDto> patchBookDetail(
            @PathVariable Integer id,
            @RequestBody BookDetail detailUpdates) {

        Optional<Book> updatedBook = bookService.patchBookDetail(id, detailUpdates);
        return updatedBook.map(book -> {
            BookResponseDto dto = bookService.findByIdWithDetails(book.getId()).orElse(null);
            return ResponseEntity.ok(dto);
        }).orElse(ResponseEntity.notFound().build());
    }
}
