package com.example.socialpainpoint.dto.portal;

import jakarta.validation.constraints.NotBlank;

public record SubmitPainPointRequest(
  @NotBlank(message = "痛点场景不能为空")
  String sceneType,
  @NotBlank(message = "所属行业不能为空")
  String industryType,
  @NotBlank(message = "痛点内容不能为空")
  String content
) {
}
