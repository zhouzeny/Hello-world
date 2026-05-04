package com.example.socialpainpoint.service.impl;

import com.example.socialpainpoint.repository.InMemoryAdminUserRepository;
import com.example.socialpainpoint.service.AdminUserService;
import com.example.socialpainpoint.util.TimeFormats;
import com.example.socialpainpoint.vo.AdminUserVO;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AdminUserServiceImpl implements AdminUserService {

  private final InMemoryAdminUserRepository adminUserRepository;

  public AdminUserServiceImpl(InMemoryAdminUserRepository adminUserRepository) {
    this.adminUserRepository = adminUserRepository;
  }

  @Override
  public List<AdminUserVO> listUsers() {
    return adminUserRepository.findAll().stream()
      .map(item -> new AdminUserVO(
        item.id(),
        item.username(),
        item.role(),
        item.status(),
        TimeFormats.format(item.lastLoginTime())
      ))
      .toList();
  }
}
