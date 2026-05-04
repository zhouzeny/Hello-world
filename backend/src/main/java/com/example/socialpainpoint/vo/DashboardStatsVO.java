package com.example.socialpainpoint.vo;

import java.util.List;
import java.util.Map;

public record DashboardStatsVO(
  long totalReports,
  long pendingReports,
  Map<String, Long> categoryCounts,
  Map<String, Long> industryCounts,
  List<PainPointVO> recentReports
) {
}
