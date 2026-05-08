package com.example.socialpainpoint;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SocialPainPointApplication {

  public static void main(String[] args) {
    SpringApplication.run(SocialPainPointApplication.class, args);
  }

  @Bean
  public CommandLineRunner initAdminUser(JdbcTemplate jdbc, PasswordEncoder encoder) {
    return args -> {
      String password = "admin123";
      String hash = encoder.encode(password);
      
      try {
        // 1. 删除旧的 admin 账号
        jdbc.update("DELETE FROM admin_user WHERE username = 'admin'");
        
        // 2. 确保 yan123 存在且密码正确 (超级管理员)
        upsertUser(jdbc, "yan123", hash, "super_admin");
        
        // 3. 确保 zhou123 存在且密码正确 (普通管理员)
        upsertUser(jdbc, "zhou123", hash, "admin");
        
        System.out.println(">>> [INIT] Admin accounts updated: yan123 & zhou123");
      } catch (Exception e) {
        System.err.println(">>> [INIT] Failed to init admin users: " + e.getMessage());
      }
    };
  }

  private void upsertUser(JdbcTemplate jdbc, String username, String hash, String role) {
    Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM admin_user WHERE username = ?", Integer.class, username);
    if (count == null || count == 0) {
      jdbc.update("INSERT INTO admin_user (username, password_hash, role, status) VALUES (?, ?, ?, 1)",
          username, hash, role);
    } else {
      jdbc.update("UPDATE admin_user SET password_hash = ?, role = ? WHERE username = ?", hash, role, username);
    }
  }
}
