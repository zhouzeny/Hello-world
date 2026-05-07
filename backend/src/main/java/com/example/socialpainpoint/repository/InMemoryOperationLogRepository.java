package com.example.socialpainpoint.repository;

import com.example.socialpainpoint.entity.OperationLog;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class InMemoryOperationLogRepository {

  private final JdbcTemplate jdbc;

  public InMemoryOperationLogRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public OperationLog save(Long operatorId, String action, String target, String ipAddress) {
    jdbc.update(
      "INSERT INTO operation_log (operator_id, action, target, ip_address, created_at) VALUES (?,?,?,?,?)",
      operatorId == null ? 0L : operatorId,
      action,
      target,
      ipAddress,
      LocalDateTime.now()
    );
    return new OperationLog(null, operatorId, action, target, ipAddress, LocalDateTime.now());
  }

  public List<OperationLog> recent(int limit) {
    return jdbc.query(
      "SELECT * FROM operation_log ORDER BY created_at DESC LIMIT ?",
      this::mapRow,
      limit
    );
  }

  private OperationLog mapRow(ResultSet rs, int rowNum) throws SQLException {
    return new OperationLog(
      rs.getLong("id"),
      rs.getLong("operator_id"),
      rs.getString("action"),
      rs.getString("target"),
      rs.getString("ip_address"),
      rs.getObject("created_at", LocalDateTime.class)
    );
  }
}
