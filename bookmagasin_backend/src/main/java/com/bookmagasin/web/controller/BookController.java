package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/books")
@CrossOrigin(origins = "http://localhost:3000") // Để React truy cập
public class BookController {
    private final BookRepository bookRepository;
    private final BookService bookService;


    public BookController(BookRepository bookRepository, BookService bookService) {
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }
    // 🔵 Read all
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.findAll();
    }

    // 🔵 Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Integer id) {
        return bookService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🟢 Create
    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return bookService.createBook(book);
    }

    // 🔴 Update
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Integer id, @RequestBody Book book) {
        return bookService.findById(id)
                .map(existing -> {
                    book.setId(id); // giữ nguyên ID
                    return ResponseEntity.ok(bookService.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ⚫ Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        if (bookService.findById(id).isPresent()) {
            bookService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }




    @PatchMapping("/{id}/details")
    public ResponseEntity<Book> patchBookDetail(
            @PathVariable Integer id,
            @RequestBody BookDetail detailUpdates) {

        return bookRepository.findById(id).map(book -> {
            BookDetail detail = book.getBookDetail();
            if (detail != null) {
                if (detailUpdates.getPublisher() != null)
                    detail.setPublisher(detailUpdates.getPublisher());
                if (detailUpdates.getSupplier() != null)
                    detail.setSupplier(detailUpdates.getSupplier());
                if (detailUpdates.getPages() > 0)
                    detail.setPages(detailUpdates.getPages());
                if (detailUpdates.getDescription() != null)
                    detail.setDescription(detailUpdates.getDescription());
            }
            return ResponseEntity.ok(bookRepository.save(book));
        }).orElse(ResponseEntity.notFound().build());
    }
}
