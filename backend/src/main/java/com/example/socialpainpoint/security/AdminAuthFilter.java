package com.example.socialpainpoint.security;

import com.example.socialpainpoint.common.ApiResponse;
import com.example.socialpainpoint.repository.InMemoryAdminUserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class AdminAuthFilter extends OncePerRequestFilter {

  private final JwtTokenService jwtTokenService;
  private final AdminTokenStore adminTokenStore;
  private final InMemoryAdminUserRepository adminUserRepository;
  private final ObjectMapper objectMapper;

  public AdminAuthFilter(
    JwtTokenService jwtTokenService,
    AdminTokenStore adminTokenStore,
    InMemoryAdminUserRepository adminUserRepository,
    ObjectMapper objectMapper
  ) {
    this.jwtTokenService = jwtTokenService;
    this.adminTokenStore = adminTokenStore;
    this.adminUserRepository = adminUserRepository;
    this.objectMapper = objectMapper;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();
    return HttpMethod.OPTIONS.matches(request.getMethod())
      || "/api/admin/auth/login".equals(path)
      || "/api/admin/auth/logout".equals(path)
      || !path.startsWith("/api/admin/");
  }

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
  ) throws ServletException, IOException {
    String token = resolveToken(request);
    if (!isAuthorized(token)) {
      writeFail(response, "\u672a\u767b\u5f55\u6216\u767b\u5f55\u5df2\u8fc7\u671f");
      return;
    }

    filterChain.doFilter(request, response);
  }

  private boolean isAuthorized(String token) {
    String normalized = jwtTokenService.normalizeToken(token);
    if (normalized == null || normalized.isBlank() || !adminTokenStore.contains(normalized)) {
      return false;
    }

    Optional<JwtTokenService.TokenPayload> payload = jwtTokenService.parseToken(normalized);
    if (payload.isEmpty()) {
      return false;
    }

    return adminUserRepository.findByUsername(payload.get().username())
      .filter(user -> user.role().equals(payload.get().role()))
      .isPresent();
  }

  private String resolveToken(HttpServletRequest request) {
    String token = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (token == null || token.isBlank()) {
      token = request.getHeader("X-Admin-Token");
    }
    return token;
  }

  private void writeFail(HttpServletResponse response, String message) throws IOException {
    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    objectMapper.writeValue(response.getWriter(), ApiResponse.fail(message));
  }
}
