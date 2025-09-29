package com.bookmagasin.service;


import com.bookmagasin.web.dto.AuthorDto;
import com.bookmagasin.web.dtoResponse.AuthorResponseDto;

import java.util.List;
import java.util.Optional;

public interface AuthorService {
    List<AuthorResponseDto> findAll();
    Optional<AuthorResponseDto> findById(int id);

    AuthorResponseDto createAuthor(AuthorDto dto);
    AuthorResponseDto updateAuthor(int id,AuthorDto dto);
    void deleteById(int id);

}
