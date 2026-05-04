package com.example.socialpainpoint.entity;

import java.time.LocalDateTime;

public record AdminUser(
  Long id,
  String username,
  String passwordHash,
  String role,
  String status,
  LocalDateTime lastLoginTime
) {
}
