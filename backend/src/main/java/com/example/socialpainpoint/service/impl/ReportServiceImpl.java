package com.example.socialpainpoint.service.impl;

import com.example.socialpainpoint.repository.InMemoryPainPointRepository;
import com.example.socialpainpoint.service.ReportService;
import com.example.socialpainpoint.service.StatisticsService;
import com.example.socialpainpoint.util.TimeFormats;
import com.example.socialpainpoint.vo.ReportSummaryVO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

  private final StatisticsService statisticsService;
  private final InMemoryPainPointRepository painPointRepository;

  public ReportServiceImpl(StatisticsService statisticsService, InMemoryPainPointRepository painPointRepository) {
    this.statisticsService = statisticsService;
    this.painPointRepository = painPointRepository;
  }

  @Override
  public ReportSummaryVO generateSummary() {
    var dashboard = statisticsService.dashboard();
    String topCategory = statisticsService.categoryStats().stream()
      .findFirst()
      .map(item -> item.name())
      .orElse("未分类");
    String topIndustry = statisticsService.industryStats().stream()
      .findFirst()
      .map(item -> item.name())
      .orElse("未分类");

    String hotCategories = statisticsService.categoryStats().stream()
      .limit(3)
      .map(item -> item.name() + " " + item.count() + " 条")
      .collect(Collectors.joining("，"));

    String body = "当前累计收集 " + dashboard.totalReports() + " 条痛点，其中待处理 " + dashboard.pendingReports()
      + " 条。高频分类集中在 " + topCategory + "，高频行业集中在 " + topIndustry
      + "。前三类热点为：" + hotCategories + "。";

    return new ReportSummaryVO("行业痛点总结报告（示例）", body, TimeFormats.format(LocalDateTime.now()));
  }

  @Override
  public ByteArrayOutputStream exportToExcel() {
    List<com.example.socialpainpoint.entity.PainPointReport> reports = painPointRepository.findAll();

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    
    try (Workbook workbook = new XSSFWorkbook()) {
      Sheet sheet = workbook.createSheet("痛点数据");

      Row headerRow = sheet.createRow(0);
      String[] headers = {"ID", "痛点场景", "所属行业", "痛点内容", "提交时间", "状态", "分类标签"};
      for (int i = 0; i < headers.length; i++) {
        Cell cell = headerRow.createCell(i);
        cell.setCellValue(headers[i]);
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        cell.setCellStyle(headerStyle);
      }

      int rowNum = 1;
      for (com.example.socialpainpoint.entity.PainPointReport report : reports) {
        Row row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue(report.id());
        row.createCell(1).setCellValue(report.sceneType() != null ? report.sceneType() : "");
        row.createCell(2).setCellValue(report.industryType() != null ? report.industryType() : "");
        row.createCell(3).setCellValue(report.content() != null ? report.content() : "");
        row.createCell(4).setCellValue(report.submitTime() != null ? TimeFormats.format(report.submitTime()) : "");
        row.createCell(5).setCellValue(report.status() != null ? report.status() : "");
        row.createCell(6).setCellValue(report.categoryName() != null ? report.categoryName() : "");
      }

      for (int i = 0; i < headers.length; i++) {
        sheet.autoSizeColumn(i);
      }

      workbook.write(outputStream);

    } catch (IOException e) {
      throw new RuntimeException("导出Excel失败", e);
    }
    
    return outputStream;
  }
}
