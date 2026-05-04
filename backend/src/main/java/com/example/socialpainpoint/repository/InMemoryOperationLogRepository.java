package com.example.socialpainpoint.repository;

import com.example.socialpainpoint.entity.OperationLog;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class InMemoryOperationLogRepository {

  private final Map<Long, OperationLog> store = new ConcurrentHashMap<>();
  private final AtomicLong sequence = new AtomicLong(1);

  public OperationLog save(Long operatorId, String action, String target, String ipAddress) {
    Long id = sequence.getAndIncrement();
    OperationLog log = new OperationLog(id, operatorId, action, target, ipAddress, LocalDateTime.now());
    store.put(id, log);
    return log;
  }

  public List<OperationLog> recent(int limit) {
    return store.values().stream()
      .sorted(Comparator.comparing(OperationLog::createdAt).reversed())
      .limit(limit)
      .toList();
  }
}
