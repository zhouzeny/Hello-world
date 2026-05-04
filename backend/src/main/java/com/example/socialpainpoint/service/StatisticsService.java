package com.example.socialpainpoint.service;

import com.example.socialpainpoint.vo.CategoryStatVO;
import com.example.socialpainpoint.vo.DashboardStatsVO;
import com.example.socialpainpoint.vo.IndustryStatVO;
import java.util.List;

public interface StatisticsService {

  DashboardStatsVO dashboard();

  List<CategoryStatVO> categoryStats();

  List<IndustryStatVO> industryStats();
}
