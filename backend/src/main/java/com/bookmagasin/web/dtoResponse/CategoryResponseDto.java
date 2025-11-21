package com.bookmagasin.web.dtoResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDto {
    private int id;
    private String name;
    private Integer parentId;
    private List<Integer> bookIds; // chỉ trả id các book
}
