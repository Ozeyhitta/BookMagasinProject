package com.bookmagasin.service.impl;

import com.bookmagasin.entity.SupportRequest;
import com.bookmagasin.repository.SupportRequestRepository;
import com.bookmagasin.service.SupportRequestService;
import com.bookmagasin.web.dto.SupportRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SupportRequestServiceImpl implements SupportRequestService {

    private final SupportRequestRepository repository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String notificationRecipient;

    @Override
    @Transactional
    public Map<String, Object> createSupportRequest(SupportRequestDto dto) {
        SupportRequest req = SupportRequest.builder()
                .email(dto.getEmail())
                .type(dto.getType())
                .issue(dto.getIssue())
                .description(dto.getDescription())
                .status("OPEN")
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(req);

        // Send simple notification to configured recipient (e.g. support mailbox)
        try {
            if (notificationRecipient != null && !notificationRecipient.isEmpty()) {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(notificationRecipient);
                msg.setSubject("Yêu cầu hỗ trợ mới - " + (req.getIssue() == null ? "(không tiêu đề)" : req.getIssue()));
                msg.setText("Có yêu cầu hỗ trợ mới từ: " + req.getEmail()
                        + "\nLoại: " + req.getType()
                        + "\nVấn đề: " + req.getIssue()
                        + "\n\nMô tả:\n" + req.getDescription()
                        + "\n\nID yêu cầu: " + req.getId());
                mailSender.send(msg);
            }
        } catch (Exception ignored) {
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", req.getId());
        resp.put("status", req.getStatus());
        return resp;
    }

    @Override
    public List<Map<String, Object>> listSupportRequests(String status) {
        List<SupportRequest> list;
        if (status == null || status.isBlank()) list = repository.findAll();
        else list = repository.findByStatus(status);

        List<Map<String, Object>> out = new ArrayList<>();
        for (SupportRequest r : list) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", r.getId());
            m.put("email", r.getEmail());
            m.put("type", r.getType());
            m.put("issue", r.getIssue());
            m.put("description", r.getDescription());
            m.put("status", r.getStatus());
            m.put("staffResponse", r.getStaffResponse());
            m.put("createdAt", r.getCreatedAt());
            m.put("resolvedAt", r.getResolvedAt());
            out.add(m);
        }
        return out;
    }

    @Override
    @Transactional
    public Map<String, Object> replyToRequest(Integer id, String response, Integer staffId, String staffName) {
        SupportRequest r = repository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu: " + id));
        r.setStaffResponse(response);
        r.setStaffId(staffId);
        r.setStaffName(staffName);
        r.setStatus("RESOLVED");
        r.setResolvedAt(LocalDateTime.now());
        repository.save(r);

        // send email back to user
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(r.getEmail());
            msg.setSubject("Phản hồi từ BookMagasin về yêu cầu hỗ trợ: " + (r.getIssue() == null ? "(không tiêu đề)" : r.getIssue()));
            msg.setText("Xin chào,\n\nNhân viên " + (staffName == null ? "BookMagasin" : staffName) + " đã trả lời yêu cầu của bạn:\n\n"
                    + response + "\n\nNếu cần hỗ trợ thêm, vui lòng trả lời email này hoặc gửi yêu cầu mới.");
            mailSender.send(msg);
        } catch (Exception ignored) {
        }

        Map<String, Object> out = new HashMap<>();
        out.put("id", r.getId());
        out.put("status", r.getStatus());
        return out;
    }
}
