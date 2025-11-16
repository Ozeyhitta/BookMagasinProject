package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderStatusHistory;
import com.bookmagasin.repository.OrderRepository;
import com.bookmagasin.repository.OrderStatusHistoryRepository;
import com.bookmagasin.service.OrderStatusHistoryService;
import com.bookmagasin.web.dto.OrderStatusHistoryDto;
import com.bookmagasin.web.dtoResponse.OrderStatusHistoryResponseDto;
import com.bookmagasin.web.mapper.OrderStatusHistoryMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderStatusHistoryServiceImpl implements OrderStatusHistoryService {

    private final OrderStatusHistoryRepository historyRepository;
    private final OrderRepository orderRepository;

    public OrderStatusHistoryServiceImpl(
            OrderStatusHistoryRepository historyRepository,
            OrderRepository orderRepository) {
        this.historyRepository = historyRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public List<OrderStatusHistoryResponseDto> findAll() {
        return historyRepository.findAll()
                .stream()
                .map(OrderStatusHistoryMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<OrderStatusHistoryResponseDto> findById(Integer id) {
        return historyRepository.findById(id)
                .map(OrderStatusHistoryMapper::toResponseDto);
    }

    @Override
    public List<OrderStatusHistoryResponseDto> findByOrderId(Integer orderId) {
        return historyRepository.findByOrder_Id(orderId)
                .stream()
                .map(OrderStatusHistoryMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderStatusHistoryResponseDto save(OrderStatusHistoryDto dto) {
        OrderStatusHistory history = OrderStatusHistoryMapper.toEntity(dto);
        
        // Set Order nếu có orderId
        if (dto.getOrderId() != null) {
            Order order = orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + dto.getOrderId()));
            history.setOrder(order);
        }
        
        // Nếu không có statusChangeDate, set ngày hiện tại
        if (history.getStatusChangeDate() == null) {
            history.setStatusChangeDate(new Date());
        }
        
        OrderStatusHistory saved = historyRepository.save(history);
        return OrderStatusHistoryMapper.toResponseDto(saved);
    }

    @Override
    public OrderStatusHistoryResponseDto update(Integer id, OrderStatusHistoryDto dto) {
        return historyRepository.findById(id).map(existing -> {
            // Update các trường
            OrderStatusHistoryMapper.updateEntity(existing, dto);
            
            // Update Order nếu có orderId mới
            if (dto.getOrderId() != null) {
                Order order = orderRepository.findById(dto.getOrderId())
                        .orElseThrow(() -> new RuntimeException("Order not found with id: " + dto.getOrderId()));
                existing.setOrder(order);
            }
            
            OrderStatusHistory saved = historyRepository.save(existing);
            return OrderStatusHistoryMapper.toResponseDto(saved);
            
        }).orElseThrow(() -> new RuntimeException("Order Status History not found with id: " + id));
    }

    @Override
    public void deleteById(Integer id) {
        if (!historyRepository.existsById(id)) {
            throw new RuntimeException("Order Status History not found with id: " + id);
        }
        historyRepository.deleteById(id);
    }
}

