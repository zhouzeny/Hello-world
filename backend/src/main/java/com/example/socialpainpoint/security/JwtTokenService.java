package com.example.socialpainpoint.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

  public String generateToken(String username, String role) {
    String raw = username + ":" + role + ":" + Instant.now().getEpochSecond();
    return Base64.getUrlEncoder().withoutPadding().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
  }

  public String normalizeToken(String token) {
    if (token == null) {
      return null;
    }

    String normalized = token.trim();
    if (normalized.regionMatches(true, 0, "Bearer ", 0, 7)) {
      normalized = normalized.substring(7).trim();
    }
    return normalized;
  }

  public Optional<TokenPayload> parseToken(String token) {
    String normalized = normalizeToken(token);
    if (normalized == null || normalized.isBlank()) {
      return Optional.empty();
    }

    try {
      String decoded = new String(Base64.getUrlDecoder().decode(normalized), StandardCharsets.UTF_8);
      String[] parts = decoded.split(":", 3);
      if (parts.length != 3) {
        return Optional.empty();
      }

      return Optional.of(new TokenPayload(parts[0], parts[1], Long.parseLong(parts[2])));
    } catch (IllegalArgumentException exception) {
      return Optional.empty();
    }
  }

  public record TokenPayload(String username, String role, long issuedAt) {
  }
}
