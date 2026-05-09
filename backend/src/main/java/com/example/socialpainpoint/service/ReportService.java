package com.example.socialpainpoint.service;

import com.example.socialpainpoint.vo.ReportSummaryVO;

import java.io.ByteArrayOutputStream;

public interface ReportService {

  ReportSummaryVO generateSummary();

  ByteArrayOutputStream exportToExcel();
}
