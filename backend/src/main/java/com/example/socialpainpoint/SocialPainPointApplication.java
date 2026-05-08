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
      String username = "admin";
      String password = "admin123";
      String hash = encoder.encode(password);
      
      try {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM admin_user WHERE username = ?", Integer.class, username);
        if (count == null || count == 0) {
          jdbc.update("INSERT INTO admin_user (username, password_hash, role, status) VALUES (?, ?, 'super_admin', 1)",
              username, hash);
          System.out.println(">>> [INIT] Created default admin: admin / admin123");
        } else {
          jdbc.update("UPDATE admin_user SET password_hash = ? WHERE username = ?", hash, username);
          System.out.println(">>> [INIT] Reset admin password to: admin123");
        }
      } catch (Exception e) {
        System.err.println(">>> [INIT] Failed to init admin user: " + e.getMessage());
      }
    };
  }
}
