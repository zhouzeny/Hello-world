package com.example.socialpainpoint.security;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class AdminTokenStore {

  private final Set<String> activeTokens = ConcurrentHashMap.newKeySet();

  public void register(String token) {
    if (token != null && !token.isBlank()) {
      activeTokens.add(token);
    }
  }

  public void revoke(String token) {
    if (token != null && !token.isBlank()) {
      activeTokens.remove(token);
    }
  }

  public boolean contains(String token) {
    return token != null && !token.isBlank() && activeTokens.contains(token);
  }
}
