package com.bookmagasin.web.dtoResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private double monthlyRevenue;
    private double monthlyRevenueChangePercent;
    private long pendingOrders;
    private long pendingApprovals;
}
