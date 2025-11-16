package com.bookmagasin.service;



import com.bookmagasin.entity.Category;
import com.bookmagasin.web.dto.CategoryDto;
import com.bookmagasin.web.dtoResponse.CategoryResponseDto;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    CategoryResponseDto createCategory(CategoryDto dto);
    List<CategoryResponseDto> getAllCategories();
    Optional<CategoryResponseDto> getCategoryById(int id);
    CategoryResponseDto updateCategory(int id, CategoryDto dto);
    void deleteCategory(int id);

}
