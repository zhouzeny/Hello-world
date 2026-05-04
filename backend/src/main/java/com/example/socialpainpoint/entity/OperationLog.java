package com.example.socialpainpoint.entity;

import java.time.LocalDateTime;

public record OperationLog(
  Long id,
  Long operatorId,
  String action,
  String target,
  String ipAddress,
  LocalDateTime createdAt
) {
}
