package com.bookmagasin.web.controller;

import com.bookmagasin.enums.EStatusBooking;
import com.bookmagasin.repository.OrderRepository;
import com.bookmagasin.service.SalesReportService;
import com.bookmagasin.web.dtoResponse.DashboardSummaryDto;
import com.bookmagasin.web.dtoResponse.SalesReportResponseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("api/dashboard")
public class DashboardController {

    private final SalesReportService salesReportService;
    private final OrderRepository orderRepository;

    public DashboardController(SalesReportService salesReportService, OrderRepository orderRepository) {
        this.salesReportService = salesReportService;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/summary")
    public DashboardSummaryDto getSummary() {
        LocalDate today = LocalDate.now();
        LocalDate currentStart = today.withDayOfMonth(1);

        LocalDate previousEnd = currentStart.minusDays(1);
        LocalDate previousStart = previousEnd.withDayOfMonth(1);

        SalesReportResponseDto currentReport = salesReportService.buildSalesReport(currentStart, today);
        SalesReportResponseDto previousReport = salesReportService.buildSalesReport(previousStart, previousEnd);

        double currentRevenue = currentReport.getTotalRevenue();
        double previousRevenue = previousReport.getTotalRevenue();
        double changePercent = previousRevenue > 0
                ? ((currentRevenue - previousRevenue) / previousRevenue) * 100d
                : 0d;

        long pendingOrders = orderRepository.countByStatus(EStatusBooking.PENDING);

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setMonthlyRevenue(currentRevenue);
        dto.setMonthlyRevenueChangePercent(changePercent);
        dto.setPendingOrders(pendingOrders);
        dto.setPendingApprovals(pendingOrders);
        return dto;
    }
}
