package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.web.dto.BookDto;
import com.bookmagasin.web.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDto {
    private int id;
    private UserDto user;
    private BookDto book;
    private int quantity;       // nên có, giỏ hàng mà
    private Date createAt;
    private Date updateAt;
}

