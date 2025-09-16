package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Book;
import com.bookmagasin.web.dto.BookDto;

import java.util.List;


public interface BookMapper {
    BookDto toDto(Book book);
    Book toEntity(BookDto dto);

    List<BookDto> toDtoList(List<Book> books);
}
