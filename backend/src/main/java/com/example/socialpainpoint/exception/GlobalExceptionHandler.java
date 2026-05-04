package com.example.socialpainpoint.exception;

import com.example.socialpainpoint.common.ApiResponse;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BizException.class)
  public ResponseEntity<ApiResponse<Void>> handleBizException(BizException exception) {
    return ResponseEntity.ok(ApiResponse.fail(exception.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
    String message = exception.getBindingResult().getFieldErrors().stream()
      .map(FieldError::getDefaultMessage)
      .collect(Collectors.joining("；"));
    return ResponseEntity.ok(ApiResponse.fail(message.isBlank() ? "参数校验失败" : message));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleException(Exception exception) {
    return ResponseEntity.ok(ApiResponse.fail(exception.getMessage() == null ? "系统异常" : exception.getMessage()));
  }
}
