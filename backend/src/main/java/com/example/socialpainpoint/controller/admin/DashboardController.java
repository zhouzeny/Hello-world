package com.example.socialpainpoint.controller.admin;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.service.StatisticsService;
import com.example.socialpainpoint.vo.DashboardStatsVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

  private final StatisticsService statisticsService;

  public DashboardController(StatisticsService statisticsService) {
    this.statisticsService = statisticsService;
  }

  @GetMapping("/stats")
  public ApiResponse<DashboardStatsVO> stats() {
    return ApiResponse.ok(statisticsService.dashboard());
  }
}
