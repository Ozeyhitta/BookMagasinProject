package com.bookmagasin.web.dto;

import com.bookmagasin.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendNotificationRequest {
    private Notification notification;   // thông báo cần gửi
    private List<Integer> userIds;       // danh sách id user nhận thông báo
}
