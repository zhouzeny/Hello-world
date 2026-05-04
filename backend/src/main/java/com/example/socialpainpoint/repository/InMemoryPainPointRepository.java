package com.example.socialpainpoint.repository;

import com.example.socialpainpoint.entity.PainPointReport;
import com.example.socialpainpoint.exception.BizException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class InMemoryPainPointRepository {

  private final Map<Long, PainPointReport> store = new ConcurrentHashMap<>();
  private final AtomicLong sequence = new AtomicLong(1004);

  public InMemoryPainPointRepository() {
    seed();
  }

  public List<PainPointReport> findAll() {
    return store.values().stream()
      .sorted(Comparator.comparing(PainPointReport::submitTime).reversed())
      .toList();
  }

  public Optional<PainPointReport> findById(Long id) {
    return Optional.ofNullable(store.get(id));
  }

  public PainPointReport save(PainPointReport report) {
    Long id = report.id() == null ? sequence.getAndIncrement() : report.id();
    PainPointReport stored = new PainPointReport(
      id,
      report.sceneType(),
      report.industryType(),
      report.content(),
      report.contactWay(),
      report.contactInfoEncrypted(),
      report.submitTime(),
      report.status(),
      report.categoryName()
    );
    store.put(id, stored);
    return stored;
  }

  public PainPointReport updateCategory(Long id, String categoryName) {
    PainPointReport current = findById(id).orElseThrow(() -> new BizException("痛点记录不存在"));
    PainPointReport updated = new PainPointReport(
      current.id(),
      current.sceneType(),
      current.industryType(),
      current.content(),
      current.contactWay(),
      current.contactInfoEncrypted(),
      current.submitTime(),
      "已分类",
      categoryName
    );
    store.put(id, updated);
    return updated;
  }

  public long countPending() {
    return findAll().stream().filter(item -> !"已分类".equals(item.status())).count();
  }

  public Map<String, Long> countByCategory() {
    return findAll().stream()
      .collect(Collectors.groupingBy(
        item -> normalized(item.categoryName()),
        Collectors.counting()
      ));
  }

  public Map<String, Long> countByIndustry() {
    return findAll().stream()
      .collect(Collectors.groupingBy(
        item -> normalized(item.industryType()),
        Collectors.counting()
      ));
  }

  public List<PainPointReport> recent(int limit) {
    return findAll().stream().limit(limit).toList();
  }

  private void seed() {
    save(new PainPointReport(
      1001L,
      "生活类痛点",
      "物业民生",
      "小区夜间噪音较大，影响休息。",
      "手机号",
      encrypt("13800000001"),
      LocalDateTime.of(2026, 5, 1, 9, 20, 0),
      "已分类",
      "环境噪音"
    ));
    save(new PainPointReport(
      1002L,
      "工作类痛点",
      "职场办公",
      "审批流程过长，跨部门沟通成本高。",
      "邮箱",
      encrypt("user@example.com"),
      LocalDateTime.of(2026, 5, 1, 10, 10, 0),
      "待分类",
      "流程效率"
    ));
    save(new PainPointReport(
      1003L,
      "生活类痛点",
      "交通出行",
      "早高峰地铁换乘拥挤，通勤时间不稳定。",
      "匿名",
      "",
      LocalDateTime.of(2026, 5, 1, 11, 5, 0),
      "已分类",
      "出行拥堵"
    ));
  }

  private String encrypt(String value) {
    return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
  }

  private String normalized(String value) {
    return value == null || value.isBlank() ? "未分类" : value;
  }
}
