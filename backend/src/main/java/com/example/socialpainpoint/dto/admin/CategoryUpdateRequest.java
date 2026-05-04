package com.example.socialpainpoint.dto.admin;

import jakarta.validation.constraints.NotBlank;

public record CategoryUpdateRequest(
  @NotBlank(message = "分类名称不能为空")
  String categoryName
) {
}
