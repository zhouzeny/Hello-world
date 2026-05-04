package com.example.socialpainpoint.service.impl;

import com.example.socialpainpoint.dto.admin.LoginRequest;
import com.example.socialpainpoint.entity.AdminUser;
import com.example.socialpainpoint.exception.BizException;
import com.example.socialpainpoint.repository.InMemoryAdminUserRepository;
import com.example.socialpainpoint.repository.InMemoryOperationLogRepository;
import com.example.socialpainpoint.security.AdminTokenStore;
import com.example.socialpainpoint.security.JwtTokenService;
import com.example.socialpainpoint.service.AuthService;
import com.example.socialpainpoint.vo.LoginVO;
import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

  private final InMemoryAdminUserRepository adminUserRepository;
  private final InMemoryOperationLogRepository operationLogRepository;
  private final JwtTokenService jwtTokenService;
  private final AdminTokenStore adminTokenStore;
  private final PasswordEncoder passwordEncoder;

  public AuthServiceImpl(
    InMemoryAdminUserRepository adminUserRepository,
    InMemoryOperationLogRepository operationLogRepository,
    JwtTokenService jwtTokenService,
    AdminTokenStore adminTokenStore,
    PasswordEncoder passwordEncoder
  ) {
    this.adminUserRepository = adminUserRepository;
    this.operationLogRepository = operationLogRepository;
    this.jwtTokenService = jwtTokenService;
    this.adminTokenStore = adminTokenStore;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public LoginVO login(LoginRequest request) {
    AdminUser adminUser = adminUserRepository.findByUsername(request.username())
      .orElseThrow(() -> new BizException("\u8d26\u53f7\u6216\u5bc6\u7801\u9519\u8bef"));

    if (!"\u542F\u7528".equals(adminUser.status())) {
      throw new BizException("\u8d26\u53f7\u5df2\u505c\u7528");
    }

    if (!passwordEncoder.matches(request.password(), adminUser.passwordHash())) {
      throw new BizException("\u8d26\u53f7\u6216\u5bc6\u7801\u9519\u8bef");
    }

    adminUserRepository.touchLogin(adminUser.username(), LocalDateTime.now());
    operationLogRepository.save(adminUser.id(), "ADMIN_LOGIN", "admin_user:" + adminUser.username(), "127.0.0.1");

    String token = jwtTokenService.generateToken(adminUser.username(), adminUser.role());
    adminTokenStore.register(token);
    return new LoginVO(token, adminUser.username(), adminUser.role());
  }

  @Override
  public String logout(String token) {
    adminTokenStore.revoke(jwtTokenService.normalizeToken(token));
    operationLogRepository.save(null, "ADMIN_LOGOUT", "auth", "127.0.0.1");
    return "\u5df2\u9000\u51fa";
  }
}
