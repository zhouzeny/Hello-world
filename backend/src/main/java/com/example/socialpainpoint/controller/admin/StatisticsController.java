package com.example.socialpainpoint.controller.admin;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.service.StatisticsService;
import com.example.socialpainpoint.vo.CategoryStatVO;
import com.example.socialpainpoint.vo.IndustryStatVO;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/statistics")
public class StatisticsController {

  private final StatisticsService statisticsService;

  public StatisticsController(StatisticsService statisticsService) {
    this.statisticsService = statisticsService;
  }

  @GetMapping("/category")
  public ApiResponse<List<CategoryStatVO>> categoryStats() {
    return ApiResponse.ok(statisticsService.categoryStats());
  }

  @GetMapping("/industry")
  public ApiResponse<List<IndustryStatVO>> industryStats() {
    return ApiResponse.ok(statisticsService.industryStats());
  }
}

