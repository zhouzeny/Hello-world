package com.example.socialpainpoint.service.impl;

import com.example.socialpainpoint.repository.InMemoryPainPointRepository;
import com.example.socialpainpoint.service.StatisticsService;
import com.example.socialpainpoint.util.TimeFormats;
import com.example.socialpainpoint.vo.CategoryStatVO;
import com.example.socialpainpoint.vo.DashboardStatsVO;
import com.example.socialpainpoint.vo.IndustryStatVO;
import com.example.socialpainpoint.vo.PainPointVO;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StatisticsServiceImpl implements StatisticsService {

  private final InMemoryPainPointRepository painPointRepository;

  public StatisticsServiceImpl(InMemoryPainPointRepository painPointRepository) {
    this.painPointRepository = painPointRepository;
  }

  @Override
  public DashboardStatsVO dashboard() {
    List<PainPointVO> recent = painPointRepository.recent(5).stream()
      .map(this::toVO)
      .toList();
    return new DashboardStatsVO(
      painPointRepository.countAll(),
      painPointRepository.countPending(),
      painPointRepository.countByCategory(),
      painPointRepository.countByIndustry(),
      recent
    );
  }

  @Override
  public List<CategoryStatVO> categoryStats() {
    return painPointRepository.countByCategory().entrySet().stream()
      .sorted((left, right) -> Long.compare(right.getValue(), left.getValue()))
      .map(entry -> new CategoryStatVO(entry.getKey(), entry.getValue()))
      .toList();
  }

  @Override
  public List<IndustryStatVO> industryStats() {
    return painPointRepository.countByIndustry().entrySet().stream()
      .sorted((left, right) -> Long.compare(right.getValue(), left.getValue()))
      .map(entry -> new IndustryStatVO(entry.getKey(), entry.getValue()))
      .toList();
  }

  private PainPointVO toVO(com.example.socialpainpoint.entity.PainPointReport report) {
    return new PainPointVO(
      report.id(),
      report.sceneType(),
      report.industryType(),
      report.content(),
      TimeFormats.format(report.submitTime()),
      report.status(),
      report.categoryName()
    );
  }
}
