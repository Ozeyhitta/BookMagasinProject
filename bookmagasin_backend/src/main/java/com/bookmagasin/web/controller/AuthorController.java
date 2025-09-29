package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Author;
import com.bookmagasin.service.AuthorService;
import com.bookmagasin.web.dto.AuthorDto;
import com.bookmagasin.web.dtoResponse.AuthorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {
    private final AuthorService service;

    public AuthorController(AuthorService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AuthorResponseDto>> getAll(){
        return ResponseEntity.ok(service.findAll());
    }
    @GetMapping("/id")
    public ResponseEntity<AuthorResponseDto> getById(@PathVariable int id){
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    @PostMapping
    public ResponseEntity<AuthorResponseDto> create(@RequestBody AuthorDto dto){
        AuthorResponseDto created=service.createAuthor(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthorResponseDto> update(@PathVariable int id,@RequestBody AuthorDto dto){
        try {
            AuthorResponseDto updated=service.updateAuthor(id,dto);
            return ResponseEntity.ok(updated);

        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id){
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
