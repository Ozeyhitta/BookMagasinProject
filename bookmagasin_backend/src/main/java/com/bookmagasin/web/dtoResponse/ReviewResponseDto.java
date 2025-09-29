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
public class ReviewResponseDto {
    private int id;
    private int rate;
    private String content;
    private Date createAt;
    private BookDto book;   // có thể chỉ bao gồm id + title
    private UserDto createBy; // chỉ id + fullName
}
