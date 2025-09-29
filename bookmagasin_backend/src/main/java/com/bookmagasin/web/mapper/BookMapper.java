package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Author;
import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.web.dto.BookDto;

import java.util.List;

public class BookMapper {

    public static BookDto toDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setSellingPrice(book.getSellingPrice());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setEdition(book.getEdition());
        dto.setAuthorId(book.getAuthor() != null ? book.getAuthor().getId() : 0);
        dto.setBookDetailId(book.getBookDetail() != null ? book.getBookDetail().getId() : 0);
        return dto;
    }

    public static Book toEntity(BookDto dto, Author author, BookDetail detail) {
        Book book = new Book();
        book.setId(dto.getId());
        book.setTitle(dto.getTitle());
        book.setSellingPrice(dto.getSellingPrice());
        book.setPublicationDate(dto.getPublicationDate());
        book.setEdition(dto.getEdition());
        book.setAuthor(author);
        book.setBookDetail(detail);
        return book;
    }
}
