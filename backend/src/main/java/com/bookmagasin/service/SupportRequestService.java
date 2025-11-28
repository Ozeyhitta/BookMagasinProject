package com.bookmagasin.service;

import com.bookmagasin.web.dto.SupportRequestDto;

import java.util.List;
import java.util.Map;

public interface SupportRequestService {
    Map<String, Object> createSupportRequest(SupportRequestDto dto);

    List<Map<String, Object>> listSupportRequests(String status);

    Map<String, Object> replyToRequest(Integer id, String response, Integer staffId, String staffName);
}
