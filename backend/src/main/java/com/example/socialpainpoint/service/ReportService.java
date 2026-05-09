package com.example.socialpainpoint.service;

import com.example.socialpainpoint.vo.ReportSummaryVO;

import java.io.ByteArrayOutputStream;
import java.util.Collection;

public interface ReportService {

  ReportSummaryVO generateSummary();

  ByteArrayOutputStream exportToExcel();

  ByteArrayOutputStream exportDatasetCsv(Collection<Long> ids);
}
