package com.example.socialpainpoint.entity;

import java.time.LocalDateTime;

public record PainPointReport(
  Long id,
  String sceneType,
  String industryType,
  String content,
  LocalDateTime submitTime,
  String status,
  String categoryName
) {
}
