package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.BookDetail;
import com.bookmagasin.web.dto.BookDetailDto;
import com.bookmagasin.web.dto.BookDto;

public class BookMapper {

    public static BookDto toDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setCode(book.getCode());
        dto.setSellingPrice(book.getSellingPrice());
        dto.setStockQuantity(book.getStockQuantity());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setEdition(book.getEdition());
        dto.setAuthor(book.getAuthor());
        if (book.getBookDetail() != null) {
            dto.setBookDetailId(book.getBookDetail().getId());
            dto.setBookDetail(toDetailDto(book.getBookDetail()));
        }
        return dto;
    }

    public static Book toEntity(BookDto dto, BookDetail detail) {
        Book book = new Book();
        book.setId(dto.getId());
        book.setTitle(dto.getTitle());
        book.setCode(dto.getCode());
        book.setSellingPrice(dto.getSellingPrice());
        book.setStockQuantity(dto.getStockQuantity());
        book.setPublicationDate(dto.getPublicationDate());
        book.setEdition(dto.getEdition());
        book.setAuthor(dto.getAuthor());
        if (dto.getBookDetail() != null) {
            BookDetail target = detail != null ? detail : new BookDetail();
            applyDetail(dto.getBookDetail(), target);
            book.setBookDetail(target);
        } else {
            book.setBookDetail(detail);
        }
        return book;
    }

    private static BookDetailDto toDetailDto(BookDetail detail) {
        BookDetailDto dto = new BookDetailDto();
        dto.setId(detail.getId());
        dto.setPublisher(detail.getPublisher());
        dto.setSupplier(detail.getSupplier());
        dto.setLength(detail.getLength());
        dto.setWidth(detail.getWidth());
        dto.setHeight(detail.getHeight());
        dto.setWeight(detail.getWeight());
        dto.setPages(detail.getPages());
        dto.setDescription(detail.getDescription());
        dto.setImageUrl(detail.getImageUrl());
        return dto;
    }

    private static void applyDetail(BookDetailDto detailDto, BookDetail detail) {
        detail.setPublisher(detailDto.getPublisher());
        detail.setSupplier(detailDto.getSupplier());
        detail.setLength(detailDto.getLength());
        detail.setWidth(detailDto.getWidth());
        detail.setHeight(detailDto.getHeight());
        detail.setWeight(detailDto.getWeight());
        detail.setPages(detailDto.getPages());
        detail.setDescription(detailDto.getDescription());
        detail.setImageUrl(detailDto.getImageUrl());
    }
}
