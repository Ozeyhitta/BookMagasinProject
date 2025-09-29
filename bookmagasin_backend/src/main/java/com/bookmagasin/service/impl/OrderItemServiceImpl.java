package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Book;
import com.bookmagasin.entity.Order;
import com.bookmagasin.entity.OrderItem;
import com.bookmagasin.repository.BookRepository;
import com.bookmagasin.repository.OrderItemRepository;
import com.bookmagasin.repository.OrderRepository;
import com.bookmagasin.service.OrderItemService;
import com.bookmagasin.web.dto.OrderItemDto;
import com.bookmagasin.web.dtoResponse.OrderItemResponseDto;
import com.bookmagasin.web.mapper.OrderItemMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;

    public OrderItemServiceImpl(OrderItemRepository orderItemRepository,
                                BookRepository bookRepository,
                                OrderRepository orderRepository) {
        this.orderItemRepository = orderItemRepository;
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public OrderItemResponseDto createOrderItem(OrderItemDto dto) {
        Book book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderItem orderItem = OrderItemMapper.toEntity(dto, book, order);
        OrderItem saved = orderItemRepository.save(orderItem);
        return OrderItemMapper.toResponseDto(saved);
    }

    @Override
    public List<OrderItemResponseDto> getAllOrderItems() {
        return orderItemRepository.findAll()
                .stream()
                .map(OrderItemMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<OrderItemResponseDto> getOrderItemsByOrderId(Integer orderId) {
        return orderItemRepository.findByOrder_Id(orderId)
                .stream()
                .map(OrderItemMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<OrderItemResponseDto> getOrderItemById(Integer id) {
        return orderItemRepository.findById(id)
                .map(OrderItemMapper::toResponseDto);
    }

    @Override
    public OrderItemResponseDto updateOrderItem(Integer id, OrderItemDto dto) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));

        Book book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        orderItem.setBook(book);
        orderItem.setOrder(order);
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setPrice(dto.getPrice());

        OrderItem updated = orderItemRepository.save(orderItem);
        return OrderItemMapper.toResponseDto(updated);
    }

    @Override
    public void deleteOrderItem(Integer id) {
        orderItemRepository.deleteById(id);
    }


}
