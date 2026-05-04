package com.example.socialpainpoint.controller.admin;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.dto.admin.CategoryUpdateRequest;
import com.example.socialpainpoint.service.PainPointService;
import com.example.socialpainpoint.vo.PainPointVO;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/pain-points")
public class PainPointController {

  private final PainPointService painPointService;

  public PainPointController(PainPointService painPointService) {
    this.painPointService = painPointService;
  }

  @GetMapping
  public ApiResponse<List<PainPointVO>> list() {
    return ApiResponse.ok(painPointService.listAll());
  }

  @PutMapping("/{id}/category")
  public ApiResponse<PainPointVO> updateCategory(
    @PathVariable Long id,
    @Valid @RequestBody CategoryUpdateRequest request
  ) {
    return ApiResponse.ok(painPointService.updateCategory(id, request.categoryName()));
  }
}
