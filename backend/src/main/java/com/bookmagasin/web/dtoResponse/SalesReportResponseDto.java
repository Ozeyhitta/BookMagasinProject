package com.bookmagasin.web.dtoResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportResponseDto {
    private double totalRevenue;
    private long totalOrders;
    private long totalCustomers;
    private long totalReturns;

    private List<SeriesPointDto> revenueSeries;
    private List<CategoryRevenueDto> categoryBreakdown;
    private List<TopBookDto> topBooks;
}
