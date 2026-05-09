package com.example.socialpainpoint.controller.admin;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.service.ReportService;
import com.example.socialpainpoint.util.TimeFormats;
import com.example.socialpainpoint.vo.ReportSummaryVO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;

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

  @GetMapping("/export/excel")
  public ResponseEntity<byte[]> exportToExcel() {
    ByteArrayOutputStream outputStream = reportService.exportToExcel();
    
    String filename = "痛点数据_" + TimeFormats.formatForFile(LocalDateTime.now()) + ".xlsx";
    
    return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
      .header(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .body(outputStream.toByteArray());
  }
}
