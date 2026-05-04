package com.example.socialpainpoint.controller.admin;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.service.ReportService;
import com.example.socialpainpoint.vo.ReportSummaryVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

  private final ReportService reportService;

  public ReportController(ReportService reportService) {
    this.reportService = reportService;
  }

  @GetMapping("/export")
  public ApiResponse<ReportSummaryVO> exportSummary() {
    return ApiResponse.ok(reportService.generateSummary());
  }
}
