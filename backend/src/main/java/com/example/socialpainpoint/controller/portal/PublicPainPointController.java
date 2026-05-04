package com.example.socialpainpoint.controller.portal;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.dto.portal.SubmitPainPointRequest;
import com.example.socialpainpoint.service.PainPointService;
import com.example.socialpainpoint.vo.FormConfigVO;
import com.example.socialpainpoint.vo.SubmitResultVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicPainPointController {

  private final PainPointService painPointService;

  public PublicPainPointController(PainPointService painPointService) {
    this.painPointService = painPointService;
  }

  @GetMapping("/form-config")
  public ApiResponse<FormConfigVO> getFormConfig() {
    return ApiResponse.ok(painPointService.getFormConfig());
  }

  @PostMapping("/pain-points")
  public ApiResponse<SubmitResultVO> submit(@Valid @RequestBody SubmitPainPointRequest request) {
    return ApiResponse.ok(painPointService.submit(request));
  }
}
