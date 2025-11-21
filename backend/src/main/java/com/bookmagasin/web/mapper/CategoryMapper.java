package com.bookmagasin.web.mapper;

import com.bookmagasin.entity.Category;
import com.bookmagasin.entity.Book;

import com.bookmagasin.web.dto.CategoryDto;
import com.bookmagasin.web.dtoResponse.CategoryResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class CategoryMapper {

    // entity -> response dto
    public static CategoryResponseDto toResponseDto(Category category) {
        if (category == null) {
            return null;
        }

        CategoryResponseDto dto = new CategoryResponseDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setParentId(category.getParent() != null ? category.getParent().getId() : null);

        if (category.getBooks() != null && !category.getBooks().isEmpty()) {
            List<Integer> bookIds = category.getBooks()
                    .stream()
                    .map(Book::getId)
                    .collect(Collectors.toList());
            dto.setBookIds(bookIds);
        }

        return dto;
    }

    // dto -> entity (dùng khi tạo mới)
    public static Category toEntity(CategoryDto dto, List<Book> books) {
        if (dto == null) {
            return null;
        }

        Category category = new Category();
        category.setName(dto.getName());
        if (dto.getParentId() != null) {
            Category parent = new Category();
            parent.setId(dto.getParentId());
            category.setParent(parent);
        }
        category.setBooks(books);
        return category;
    }
}
