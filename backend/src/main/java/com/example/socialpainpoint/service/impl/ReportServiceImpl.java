package com.example.socialpainpoint.service.impl;

import com.example.socialpainpoint.service.ReportService;
import com.example.socialpainpoint.service.StatisticsService;
import com.example.socialpainpoint.util.TimeFormats;
import com.example.socialpainpoint.vo.ReportSummaryVO;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ReportServiceImpl implements ReportService {

  private final StatisticsService statisticsService;

  public ReportServiceImpl(StatisticsService statisticsService) {
    this.statisticsService = statisticsService;
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
}
