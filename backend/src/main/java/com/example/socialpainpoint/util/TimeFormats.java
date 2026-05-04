package com.example.socialpainpoint.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class TimeFormats {

  public static final DateTimeFormatter DEFAULT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

  private TimeFormats() {
  }

  public static String format(LocalDateTime time) {
    return time == null ? "" : time.format(DEFAULT);
  }
}
