package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Author;
import com.bookmagasin.repository.AuthorRepository;
import com.bookmagasin.service.AuthorService;
import com.bookmagasin.web.dto.AuthorDto;
import com.bookmagasin.web.dtoResponse.AuthorResponseDto;
import com.bookmagasin.web.mapper.AuthorMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorServiceImpl(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @Override
    public List<AuthorResponseDto> findAll() {
        return authorRepository.findAll().stream()
                .map(AuthorMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AuthorResponseDto> findById(int id) {
        return authorRepository.findById(id)
                .map(AuthorMapper::toResponseDto);
    }

    @Override
    public AuthorResponseDto createAuthor(AuthorDto dto) {
        Author author=AuthorMapper.toEntity(dto);
        Author saved=authorRepository.save(author);
        return AuthorMapper.toResponseDto(saved);
    }

    @Override
    public AuthorResponseDto updateAuthor(int id, AuthorDto dto) {
        Author author=authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        author.setName(dto.getName());
        author.setBio(dto.getBio());

        Author updated=authorRepository.save(author);
        return AuthorMapper.toResponseDto(updated);
    }

    @Override
    public void deleteById(int id) {
        authorRepository.deleteById(id);
    }

}

