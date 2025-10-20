package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.web.dto.BookDto;

public class BookMapper {

    public static BookDto toDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setSellingPrice(book.getSellingPrice());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setEdition(book.getEdition());
        dto.setAuthor(book.getAuthor());
        dto.setBookDetailId(book.getBookDetail() != null ? book.getBookDetail().getId() : 0);
        return dto;
    }

    public static Book toEntity(BookDto dto,BookDetail detail) {
        Book book = new Book();
        book.setId(dto.getId());
        book.setTitle(dto.getTitle());
        book.setSellingPrice(dto.getSellingPrice());
        book.setPublicationDate(dto.getPublicationDate());
        book.setEdition(dto.getEdition());
        book.setAuthor(dto.getAuthor());
        book.setBookDetail(detail);
        return book;
    }
}
