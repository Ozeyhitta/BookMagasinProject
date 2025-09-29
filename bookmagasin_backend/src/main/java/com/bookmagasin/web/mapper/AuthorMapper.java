package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Author;
import com.bookmagasin.entity.Book;
import com.bookmagasin.web.dto.AuthorDto;
import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dtoResponse.AuthorResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class AuthorMapper {
    public static AuthorResponseDto toResponseDto(Author author){
        AuthorResponseDto dto=new AuthorResponseDto();
        dto.setId(author.getId());
        dto.setName(author.getName());
        dto.setBio(author.getBio());

        if(author.getBooks()!=null&&!author.getBooks().isEmpty()){
            List<BookDto> bookDtos=author.getBooks().stream()
                    .map(book -> {
                        BookDto bookDto = new BookDto();
                        bookDto.setId(book.getId());
                        bookDto.setTitle(book.getTitle());
                        return bookDto;
                    })
                    .collect(Collectors.toList());
            dto.setBooks(bookDtos);
        }
        return dto;
    }
    public static Author toEntity(AuthorDto dto){
        Author author=new Author();
        author.setName(dto.getName());
        author.setBio(dto.getBio());
        return author;
    }
}
