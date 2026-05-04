package com.example.socialpainpoint.service;

import com.example.socialpainpoint.dto.portal.SubmitPainPointRequest;
import com.example.socialpainpoint.vo.FormConfigVO;
import com.example.socialpainpoint.vo.PainPointVO;
import com.example.socialpainpoint.vo.SubmitResultVO;
import java.util.List;

public interface PainPointService {

  FormConfigVO getFormConfig();

  SubmitResultVO submit(SubmitPainPointRequest request);

  List<PainPointVO> listAll();

  PainPointVO updateCategory(Long id, String categoryName);
}
