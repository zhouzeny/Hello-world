package com.example.socialpainpoint.controller.admin;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.service.ReportService;
import com.example.socialpainpoint.util.TimeFormats;
import com.example.socialpainpoint.vo.ReportSummaryVO;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

  @GetMapping("/export/excel")
  public ResponseEntity<byte[]> exportToExcel() {
    ByteArrayOutputStream outputStream = reportService.exportToExcel();
    String filename = "痛点数据_" + TimeFormats.formatForFile(LocalDateTime.now()) + ".xlsx";

    return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
        .filename(filename, StandardCharsets.UTF_8)
        .build()
        .toString())
      .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
      .body(outputStream.toByteArray());
  }

  @GetMapping("/export/dataset")
  public ResponseEntity<byte[]> exportDataset(@RequestParam(value = "ids", required = false) String ids) {
    ByteArrayOutputStream outputStream = reportService.exportDatasetCsv(parseIds(ids));
    String filename = "数据集_" + TimeFormats.formatForFile(LocalDateTime.now()) + ".csv";

    return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
        .filename(filename, StandardCharsets.UTF_8)
        .build()
        .toString())
      .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
      .body(outputStream.toByteArray());
  }

  private List<Long> parseIds(String ids) {
    if (ids == null || ids.isBlank()) {
      return List.of();
    }

    return Arrays.stream(ids.split(","))
      .map(String::trim)
      .filter(part -> !part.isEmpty())
      .filter(part -> part.matches("\\d+"))
      .map(Long::valueOf)
      .toList();
  }
}
