package com.example.socialpainpoint.repository;

import com.example.socialpainpoint.entity.AdminUser;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class InMemoryAdminUserRepository {

  private final Map<Long, AdminUser> store = new ConcurrentHashMap<>();
  private final AtomicLong sequence = new AtomicLong(3);
  private final PasswordEncoder passwordEncoder;

  public InMemoryAdminUserRepository(PasswordEncoder passwordEncoder) {
    this.passwordEncoder = passwordEncoder;
    seed();
  }

  public List<AdminUser> findAll() {
    return store.values().stream()
      .sorted((left, right) -> Long.compare(left.id(), right.id()))
      .toList();
  }

  public Optional<AdminUser> findByUsername(String username) {
    return store.values().stream()
      .filter(item -> item.username().equals(username))
      .findFirst();
  }

  public AdminUser touchLogin(String username, LocalDateTime loginTime) {
    AdminUser current = findByUsername(username).orElseThrow();
    AdminUser updated = new AdminUser(
      current.id(),
      current.username(),
      current.passwordHash(),
      current.role(),
      current.status(),
      loginTime
    );
    store.put(updated.id(), updated);
    return updated;
  }

  private void seed() {
    store.put(1L, new AdminUser(
      1L,
      "admin",
      passwordEncoder.encode("Admin@123456"),
      "超级管理员",
      "启用",
      LocalDateTime.of(2026, 5, 1, 8, 30, 0)
    ));
    store.put(2L, new AdminUser(
      2L,
      "ops_admin",
      passwordEncoder.encode("Ops@123456"),
      "运营管理员",
      "启用",
      LocalDateTime.of(2026, 5, 1, 9, 15, 0)
    ));
  }
}
