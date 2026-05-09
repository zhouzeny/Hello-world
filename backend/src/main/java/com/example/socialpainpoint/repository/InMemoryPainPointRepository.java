package com.example.socialpainpoint.repository;

import com.example.socialpainpoint.entity.PainPointReport;
import com.example.socialpainpoint.exception.BizException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;
import java.sql.PreparedStatement;
import java.sql.Statement;

@Component
public class InMemoryPainPointRepository {

  private final JdbcTemplate jdbc;

  public InMemoryPainPointRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public List<PainPointReport> findAll() {
    return jdbc.query(
      "SELECT * FROM pain_point_report ORDER BY submit_time DESC",
      this::mapRow
    );
  }

  public Optional<PainPointReport> findById(Long id) {
    List<PainPointReport> results = jdbc.query(
      "SELECT * FROM pain_point_report WHERE id = ?",
      this::mapRow,
      id
    );
    return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
  }

  public PainPointReport save(PainPointReport report) {
    if (report.id() != null) {
      jdbc.update(
        "UPDATE pain_point_report SET scene_type=?, industry_type=?, content=?, submit_time=?, status=?, review_remark=? WHERE id=?",
        report.sceneType(),
        report.industryType(),
        report.content(),
        report.submitTime(),
        0,
        report.categoryName(),
        report.id()
      );
      return report;
    } else {
      KeyHolder keyHolder = new GeneratedKeyHolder();
      jdbc.update(con -> {
        PreparedStatement ps = con.prepareStatement(
          "INSERT INTO pain_point_report (scene_type, industry_type, content, submit_time, status, review_remark) VALUES (?,?,?,?,?,?)",
          Statement.RETURN_GENERATED_KEYS
        );
        ps.setString(1, report.sceneType());
        ps.setString(2, report.industryType());
        ps.setString(3, report.content());
        ps.setObject(4, report.submitTime());
        ps.setInt(5, 0);
        ps.setString(6, report.categoryName());
        return ps;
      }, keyHolder);
      Long newId = keyHolder.getKey().longValue();
      return new PainPointReport(
        newId,
        report.sceneType(),
        report.industryType(),
        report.content(),
        report.submitTime(),
        report.status(),
        report.categoryName()
      );
    }
  }

  public PainPointReport updateCategory(Long id, String categoryName) {
    findById(id).orElseThrow(() -> new BizException("痛点记录不存在"));
    jdbc.update(
      "UPDATE pain_point_report SET status=1, review_remark=? WHERE id=?",
      categoryName,
      id
    );
    return findById(id).orElseThrow();
  }

  public PainPointReport updateStatus(Long id, int status) {
    findById(id).orElseThrow(() -> new BizException("痛点记录不存在"));
    jdbc.update(
      "UPDATE pain_point_report SET status=? WHERE id=?",
      status,
      id
    );
    return findById(id).orElseThrow();
  }

  public void deleteById(Long id) {
    jdbc.update("DELETE FROM pain_point_report WHERE id = ?", id);
  }

  public long countPending() {
    Long count = jdbc.queryForObject(
      "SELECT COUNT(*) FROM pain_point_report WHERE status = 0",
      Long.class
    );
    return count == null ? 0 : count;
  }

  public long countAll() {
    Long count = jdbc.queryForObject("SELECT COUNT(*) FROM pain_point_report", Long.class);
    return count == null ? 0 : count;
  }

  public Map<String, Long> countByCategory() {
    return jdbc.query(
      "SELECT scene_type AS cat, COUNT(*) AS cnt FROM pain_point_report GROUP BY scene_type",
      rs -> {
        Map<String, Long> map = new java.util.LinkedHashMap<>();
        while (rs.next()) {
          map.put(rs.getString("cat"), rs.getLong("cnt"));
        }
        return map;
      }
    );
  }

  public Map<String, Long> countByIndustry() {
    return jdbc.query(
      "SELECT COALESCE(NULLIF(industry_type,''), '其他') AS ind, COUNT(*) AS cnt FROM pain_point_report GROUP BY ind",
      rs -> {
        Map<String, Long> map = new java.util.LinkedHashMap<>();
        while (rs.next()) {
          map.put(rs.getString("ind"), rs.getLong("cnt"));
        }
        return map;
      }
    );
  }

  public List<PainPointReport> recent(int limit) {
    return jdbc.query(
      "SELECT * FROM pain_point_report ORDER BY submit_time DESC LIMIT ?",
      this::mapRow,
      limit
    );
  }

  private PainPointReport mapRow(ResultSet rs, int rowNum) throws SQLException {
    int statusInt = rs.getInt("status");
    String statusStr = statusInt == 1 ? "已处理" : "待处理";
    return new PainPointReport(
      rs.getLong("id"),
      rs.getString("scene_type"),
      rs.getString("industry_type"),
      rs.getString("content"),
      rs.getObject("submit_time", LocalDateTime.class),
      statusStr,
      rs.getString("review_remark")
    );
  }
}
