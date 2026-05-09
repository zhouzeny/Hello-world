package com.example.socialpainpoint.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class TimeFormats {

  public static final DateTimeFormatter DEFAULT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
  public static final DateTimeFormatter FILE_NAME = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

  private TimeFormats() {
  }

  public static String format(LocalDateTime time) {
    return time == null ? "" : time.format(DEFAULT);
  }

  public static String formatForFile(LocalDateTime time) {
    return time == null ? "" : time.format(FILE_NAME);
  }
}
