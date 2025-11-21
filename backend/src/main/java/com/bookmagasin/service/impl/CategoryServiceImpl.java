package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Category;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.repository.CategoryRepository;
import com.bookmagasin.service.CategoryService;
import com.bookmagasin.web.dto.CategoryDto;
import com.bookmagasin.web.dtoResponse.CategoryResponseDto;
import com.bookmagasin.web.mapper.CategoryMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, BookRepository bookRepository) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public CategoryResponseDto createCategory(CategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        }

        Category savedCategory = categoryRepository.save(category);

        if (dto.getBookIds() != null && !dto.getBookIds().isEmpty()) {
            List<Book> books = bookRepository.findAllById(dto.getBookIds());

            for (Book book : books) {
                if (book.getCategories() == null) {
                    book.setCategories(new ArrayList<>());
                }
                if (!book.getCategories().contains(savedCategory)) {
                    book.getCategories().add(savedCategory);
                }
            }
            bookRepository.saveAll(books);
            savedCategory.setBooks(books);
        }

        return CategoryMapper.toResponseDto(categoryRepository.save(savedCategory));
    }

    @Override
    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CategoryResponseDto> getCategoryById(int id) {
        return categoryRepository.findById(id)
                .map(CategoryMapper::toResponseDto);
    }

    @Override
    public CategoryResponseDto updateCategory(int id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(dto.getName());
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        if (dto.getBookIds() != null && !dto.getBookIds().isEmpty()) {
            List<Book> books = bookRepository.findAllById(dto.getBookIds());

            for (Book book : books) {
                if (book.getCategories() == null) {
                    book.setCategories(new ArrayList<>());
                }
                if (!book.getCategories().contains(category)) {
                    book.getCategories().add(category);
                }
            }
            bookRepository.saveAll(books);
            category.setBooks(books);
        }

        Category updated = categoryRepository.save(category);
        return CategoryMapper.toResponseDto(updated);
    }

    @Override
    public void deleteCategory(int id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            throw new RuntimeException("Cannot delete a category that has sub-categories");
        }

        if (category.getBooks() != null && !category.getBooks().isEmpty()) {
            for (Book book : category.getBooks()) {
                book.getCategories().remove(category);
            }
            bookRepository.saveAll(category.getBooks());
        }

        categoryRepository.delete(category);
    }
}
