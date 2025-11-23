package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Notification;
import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderItem;
import com.bookmagasin.entity.ReturnRequest;
import com.bookmagasin.entity.User;
import com.bookmagasin.entity.UserNotification;
import com.bookmagasin.entity.UserNotificationId;
import com.bookmagasin.enums.RequestStatus;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.repository.NotificationRepository;
import com.bookmagasin.repository.OrderItemRepository;
import com.bookmagasin.repository.OrderRepository;
import com.bookmagasin.repository.ReturnRequestRepository;
import com.bookmagasin.repository.UserNotificationRepository;
import com.bookmagasin.repository.UserRepository;
import com.bookmagasin.service.OrderService;
import com.bookmagasin.service.ReturnRequestService;
import com.bookmagasin.web.dtoResponse.ReturnRequestResponseDto;
import com.bookmagasin.web.mapper.ReturnRequestMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReturnRequestServiceImpl implements ReturnRequestService {

    private final ReturnRequestRepository returnRequestRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;
    private final NotificationRepository notificationRepository;
    private final UserNotificationRepository userNotificationRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public ReturnRequestServiceImpl(
            ReturnRequestRepository returnRequestRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            UserRepository userRepository,
            OrderService orderService,
            NotificationRepository notificationRepository,
            UserNotificationRepository userNotificationRepository) {
        this.returnRequestRepository = returnRequestRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.orderService = orderService;
        this.notificationRepository = notificationRepository;
        this.userNotificationRepository = userNotificationRepository;
    }

    @Override
    @Transactional
    public ReturnRequestResponseDto createReturnRequest(Integer orderId, Integer orderItemId, Integer quantity, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("Order item not found"));

        // Kiểm tra xem đã có return request pending cho order item này chưa
        Optional<ReturnRequest> existingRequest = returnRequestRepository
                .findByOrder_IdAndOrderItem_Id(orderId, orderItemId);
        
        if (existingRequest.isPresent() && existingRequest.get().getStatus() == RequestStatus.PENDING) {
            throw new RuntimeException("Đã có yêu cầu trả hàng đang chờ xử lý cho sản phẩm này");
        }

        // Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Số lượng phải lớn hơn 0");
        }

        if (quantity > orderItem.getQuantity()) {
            throw new RuntimeException("Số lượng trả không được vượt quá số lượng đã mua. Còn lại: " + orderItem.getQuantity());
        }

        ReturnRequest returnRequest = new ReturnRequest();
        returnRequest.setOrder(order);
        returnRequest.setOrderItem(orderItem);
        returnRequest.setQuantity(quantity);
        returnRequest.setReason(reason);
        returnRequest.setStatus(RequestStatus.PENDING);
        returnRequest.setRequestDate(new Date());

        ReturnRequest saved = returnRequestRepository.save(returnRequest);
        return ReturnRequestMapper.toResponseDto(saved);
    }

    @Override
    public List<ReturnRequestResponseDto> getAllReturnRequests() {
        return returnRequestRepository.findAll().stream()
                .map(ReturnRequestMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReturnRequestResponseDto> getReturnRequestsByStatus(String status) {
        RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
        return returnRequestRepository.findByStatus(requestStatus).stream()
                .map(ReturnRequestMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ReturnRequestResponseDto> getReturnRequestById(Integer id) {
        return returnRequestRepository.findById(id)
                .map(ReturnRequestMapper::toResponseDto);
    }

    @Override
    @Transactional
    public ReturnRequestResponseDto approveReturnRequest(Integer id, Integer staffId) {
        ReturnRequest returnRequest = returnRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Return request not found"));

        if (returnRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể duyệt yêu cầu đang chờ xử lý");
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Lưu thông tin cần thiết trước khi returnBook có thể xóa OrderItem
        Integer orderId = returnRequest.getOrder().getId();
        Integer orderItemId = returnRequest.getOrderItem().getId();
        Integer quantity = returnRequest.getQuantity();
        String bookTitle = returnRequest.getOrderItem().getBook() != null 
            ? returnRequest.getOrderItem().getBook().getTitle() 
            : "Sách";

        // Thực hiện return book thực sự
        try {
            orderService.returnBook(orderId, orderItemId, quantity);
        } catch (Exception e) {
            throw new RuntimeException("Không thể thực hiện trả hàng: " + e.getMessage());
        }

        // Flush persistence context để đảm bảo các thay đổi từ returnBook() được lưu
        entityManager.flush();

        // Reload ReturnRequest từ database để đảm bảo các reference được quản lý đúng
        // (OrderItem sẽ không bị xóa nếu có ReturnRequest đang pending)
        returnRequest = returnRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Return request not found after return"));

        // Reload OrderItem để đảm bảo reference được quản lý đúng
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("OrderItem not found after return"));
        entityManager.refresh(orderItem);
        returnRequest.setOrderItem(orderItem);
        
        // Reload Order để đảm bảo reference được quản lý
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        entityManager.refresh(order);
        returnRequest.setOrder(order);

        // Cập nhật return request
        returnRequest.setStatus(RequestStatus.APPROVED);
        returnRequest.setProcessedDate(new Date());
        returnRequest.setProcessedBy(staff);

        // Reload staff để đảm bảo reference được quản lý
        User refreshedStaff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        returnRequest.setProcessedBy(refreshedStaff);

        ReturnRequest saved = returnRequestRepository.save(returnRequest);

        // Gửi thông báo cho khách hàng
        try {
            // Sử dụng order đã được reload ở trên
            if (order != null && order.getUser() != null) {
                Notification noti = new Notification();
                noti.setTitle("Yêu cầu trả hàng đã được duyệt");
                noti.setMessage("Yêu cầu trả " + quantity + " quyển sách \"" 
                    + bookTitle + "\" đã được duyệt");
                noti.setType("CUSTOMER");
                noti.setSendDate(new Date());

                Notification savedNoti = notificationRepository.save(noti);

                UserNotification un = new UserNotification();
                un.setId(new UserNotificationId(order.getUser().getId(), savedNoti.getId()));
                un.setUser(order.getUser());
                un.setNotification(savedNoti);
                un.setRead(false);
                un.setReadAt(null);
                userNotificationRepository.save(un);
            }
        } catch (Exception ignored) {
        }

        return ReturnRequestMapper.toResponseDto(saved);
    }

    @Override
    @Transactional
    public ReturnRequestResponseDto rejectReturnRequest(Integer id, Integer staffId, String rejectionReason) {
        ReturnRequest returnRequest = returnRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Return request not found"));

        if (returnRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể từ chối yêu cầu đang chờ xử lý");
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Cập nhật return request
        returnRequest.setStatus(RequestStatus.REJECTED);
        returnRequest.setProcessedDate(new Date());
        returnRequest.setProcessedBy(staff);
        // Lưu rejection reason vào reason field hoặc tạo field mới
        // Tạm thời lưu vào reason field với format đặc biệt
        if (rejectionReason != null && !rejectionReason.trim().isEmpty()) {
            returnRequest.setReason(returnRequest.getReason() + "\n\n[Lý do từ chối: " + rejectionReason + "]");
        }

        ReturnRequest saved = returnRequestRepository.save(returnRequest);

        // Gửi thông báo cho khách hàng
        try {
            if (returnRequest.getOrder().getUser() != null) {
                Notification noti = new Notification();
                noti.setTitle("Yêu cầu trả hàng đã bị từ chối");
                noti.setMessage("Yêu cầu trả " + returnRequest.getQuantity() + " quyển sách \"" 
                    + returnRequest.getOrderItem().getBook().getTitle() + "\" đã bị từ chối" 
                    + (rejectionReason != null && !rejectionReason.trim().isEmpty() ? ". Lý do: " + rejectionReason : ""));
                noti.setType("CUSTOMER");
                noti.setSendDate(new Date());

                Notification savedNoti = notificationRepository.save(noti);

                UserNotification un = new UserNotification();
                un.setId(new UserNotificationId(returnRequest.getOrder().getUser().getId(), savedNoti.getId()));
                un.setUser(returnRequest.getOrder().getUser());
                un.setNotification(savedNoti);
                un.setRead(false);
                un.setReadAt(null);
                userNotificationRepository.save(un);
            }
        } catch (Exception ignored) {
        }

        ReturnRequestResponseDto dto = ReturnRequestMapper.toResponseDto(saved);
        // Set rejectionReason trực tiếp vào DTO
        if (rejectionReason != null && !rejectionReason.trim().isEmpty()) {
            dto.setRejectionReason(rejectionReason.trim());
        }
        return dto;
    }

    @Override
    public List<ReturnRequestResponseDto> getReturnRequestsByOrderId(Integer orderId) {
        return returnRequestRepository.findByOrder_Id(orderId)
                .stream()
                .map(ReturnRequestMapper::toResponseDto)
                .collect(Collectors.toList());
    }


}

