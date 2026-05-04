package com.example.socialpainpoint.controller.admin;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.dto.admin.LoginRequest;
import com.example.socialpainpoint.service.AuthService;
import com.example.socialpainpoint.vo.LoginVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public ApiResponse<LoginVO> login(@Valid @RequestBody LoginRequest request) {
    return ApiResponse.ok(authService.login(request));
  }

  @PostMapping("/logout")
  public ApiResponse<String> logout(@RequestHeader(value = "Authorization", required = false) String token) {
    return ApiResponse.ok(authService.logout(token));
  }
}
