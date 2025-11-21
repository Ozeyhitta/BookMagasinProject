package com.bookmagasin.service;

import com.bookmagasin.web.dtoResponse.SalesReportResponseDto;

import java.time.LocalDate;

public interface SalesReportService {
    SalesReportResponseDto buildSalesReport(LocalDate startDate, LocalDate endDate);
}
