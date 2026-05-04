package com.example.socialpainpoint.vo;

public record AdminUserVO(
  Long id,
  String username,
  String role,
  String status,
  String lastLoginTime
) {
}
