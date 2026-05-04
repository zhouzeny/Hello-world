package com.example.socialpainpoint.security;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.stereotype.Service;

@Service
public class FieldCryptoService {

  public String encrypt(String plainText) {
    if (plainText == null || plainText.isBlank()) {
      return "";
    }
    return Base64.getEncoder().encodeToString(plainText.getBytes(StandardCharsets.UTF_8));
  }

  public String decrypt(String cipherText) {
    if (cipherText == null || cipherText.isBlank()) {
      return "";
    }
    try {
      return new String(Base64.getDecoder().decode(cipherText), StandardCharsets.UTF_8);
    } catch (IllegalArgumentException exception) {
      return cipherText;
    }
  }

  public String mask(String plainText) {
    if (plainText == null || plainText.isBlank()) {
      return "";
    }
    if (plainText.length() <= 4) {
      return "***";
    }
    return plainText.substring(0, 2) + "****" + plainText.substring(plainText.length() - 2);
  }
}
