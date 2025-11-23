package com.bookmagasin.web.dtoResponse;

import com.bookmagasin.enums.RequestStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReturnRequestResponseDto {

    private int returnRequestId; // đổi tên

    private int orderId;
    private int orderItemId;

    private String orderDisplayId;
    private String bookTitle;
    private int quantity;
    private String reason;
    private RequestStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date requestDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date processedDate;

    private Integer processedBy;
    private String processedByName;

    private String rejectionReason;
}
