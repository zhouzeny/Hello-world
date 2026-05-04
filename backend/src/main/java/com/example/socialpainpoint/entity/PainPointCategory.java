package com.example.socialpainpoint.entity;

public record PainPointCategory(
  Long id,
  String categoryName,
  String categoryType,
  Integer sortOrder
) {
}
