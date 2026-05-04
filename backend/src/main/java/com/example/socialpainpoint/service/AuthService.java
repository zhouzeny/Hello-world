package com.example.socialpainpoint.service;

import com.example.socialpainpoint.dto.admin.LoginRequest;
import com.example.socialpainpoint.vo.LoginVO;

public interface AuthService {

  LoginVO login(LoginRequest request);

  String logout(String token);
}
