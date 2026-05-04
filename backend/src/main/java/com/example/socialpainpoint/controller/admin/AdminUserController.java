package com.example.socialpainpoint.controller.admin;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.service.AdminUserService;
import com.example.socialpainpoint.vo.AdminUserVO;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

  private final AdminUserService adminUserService;

  public AdminUserController(AdminUserService adminUserService) {
    this.adminUserService = adminUserService;
  }

  @GetMapping
  public ApiResponse<List<AdminUserVO>> listUsers() {
    return ApiResponse.ok(adminUserService.listUsers());
  }
}
