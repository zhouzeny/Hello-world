package com.example.socialpainpoint.repository;

import com.example.socialpainpoint.entity.AdminUser;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class InMemoryAdminUserRepository {

  private final JdbcTemplate jdbc;

  public InMemoryAdminUserRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public List<AdminUser> findAll() {
    return jdbc.query(
      "SELECT * FROM admin_user ORDER BY id ASC",
      this::mapRow
    );
  }

  public Optional<AdminUser> findByUsername(String username) {
    List<AdminUser> results = jdbc.query(
      "SELECT * FROM admin_user WHERE username = ?",
      this::mapRow,
      username
    );
    return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
  }

  public AdminUser touchLogin(String username, LocalDateTime loginTime) {
    jdbc.update(
      "UPDATE admin_user SET last_login_time = ? WHERE username = ?",
      loginTime,
      username
    );
    return findByUsername(username).orElseThrow();
  }

  private AdminUser mapRow(ResultSet rs, int rowNum) throws SQLException {
    int statusInt = rs.getInt("status");
    String statusStr = statusInt == 1 ? "启用" : "禁用";
    return new AdminUser(
      rs.getLong("id"),
      rs.getString("username"),
      rs.getString("password_hash"),
      rs.getString("role"),
      statusStr,
      rs.getObject("last_login_time", LocalDateTime.class)
    );
  }
}
