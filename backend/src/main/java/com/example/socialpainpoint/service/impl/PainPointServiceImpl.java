package com.example.socialpainpoint.service.impl;

import com.example.socialpainpoint.dto.portal.SubmitPainPointRequest;
import com.example.socialpainpoint.entity.PainPointReport;
import com.example.socialpainpoint.repository.InMemoryOperationLogRepository;
import com.example.socialpainpoint.repository.InMemoryPainPointRepository;
import com.example.socialpainpoint.service.PainPointService;
import com.example.socialpainpoint.util.TimeFormats;
import com.example.socialpainpoint.vo.FormConfigVO;
import com.example.socialpainpoint.vo.PainPointVO;
import com.example.socialpainpoint.vo.SubmitResultVO;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PainPointServiceImpl implements PainPointService {

  private static final List<String> SCENE_TYPES = List.of("生活类痛点", "工作类痛点");
  private static final List<String> INDUSTRY_TYPES = List.of(
    "教育",
    "医疗",
    "职场办公",
    "物业民生",
    "交通出行",
    "电商服务",
    "餐饮服务",
    "制造业",
    "服务业",
    "其他"
  );

  private final InMemoryPainPointRepository painPointRepository;
  private final InMemoryOperationLogRepository operationLogRepository;

  public PainPointServiceImpl(
    InMemoryPainPointRepository painPointRepository,
    InMemoryOperationLogRepository operationLogRepository
  ) {
    this.painPointRepository = painPointRepository;
    this.operationLogRepository = operationLogRepository;
  }

  @Override
  public FormConfigVO getFormConfig() {
    return new FormConfigVO(SCENE_TYPES, INDUSTRY_TYPES);
  }

  @Override
  public SubmitResultVO submit(SubmitPainPointRequest request) {
    PainPointReport saved = painPointRepository.save(new PainPointReport(
      null,
      request.sceneType(),
      request.industryType(),
      request.content(),
      LocalDateTime.now(),
      "待分类",
      null
    ));
    operationLogRepository.save(null, "SUBMIT_PAIN_POINT", "pain_point_report:" + saved.id(), "public");
    return new SubmitResultVO("PP-" + saved.id());
  }

  @Override
  public List<PainPointVO> listAll() {
    return painPointRepository.findAll().stream().map(this::toVO).toList();
  }

  @Override
  public PainPointVO updateCategory(Long id, String categoryName) {
    PainPointReport updated = painPointRepository.updateCategory(id, categoryName);
    operationLogRepository.save(null, "UPDATE_CATEGORY", "pain_point_report:" + id, "admin");
    return toVO(updated);
  }

  @Override
  public PainPointVO updateStatus(Long id, String status) {
    int statusInt = "已处理".equals(status) ? 1 : 0;
    PainPointReport updated = painPointRepository.updateStatus(id, statusInt);
    operationLogRepository.save(null, "UPDATE_STATUS", "pain_point_report:" + id + " to " + status, "admin");
    return toVO(updated);
  }

  @Override
  public void deleteById(Long id) {
    painPointRepository.deleteById(id);
    operationLogRepository.save(null, "DELETE_RECORD", "pain_point_report:" + id, "admin");
  }

  private PainPointVO toVO(PainPointReport report) {
    return new PainPointVO(
      report.id(),
      report.sceneType(),
      report.industryType(),
      report.content(),
      TimeFormats.format(report.submitTime()),
      report.status(),
      report.categoryName()
    );
  }
}
