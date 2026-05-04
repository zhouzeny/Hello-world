package com.example.socialpainpoint.vo;

public record PainPointVO(
  Long id,
  String sceneType,
  String industryType,
  String content,
  String contactWay,
  String contactInfoMasked,
  String submitTime,
  String status,
  String categoryName
) {
}
