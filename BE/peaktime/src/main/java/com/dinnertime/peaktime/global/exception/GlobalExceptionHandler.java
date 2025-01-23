package com.dinnertime.peaktime.global.exception;

import com.dinnertime.peaktime.global.util.ResultDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.format.DateTimeParseException;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<?> handleCustomException(final CustomException ex) {
        ResultDto<Object> response = ResultDto.res(
                ex.getErrorCode().getHttpStatus().value(),
                ex.getMessage()
        );

        return new ResponseEntity<>(response, ex.getErrorCode().getHttpStatus());
    }

    // 회원 정보 불일치
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(final BadCredentialsException ex) {
        ResultDto<Object> response = ResultDto.res(
                HttpStatus.NOT_FOUND.value(),
                "등록되지 않은 아이디이거나 아이디 또는 비밀번호를 잘못 입력했습니다."
        );

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // 회원탈퇴한 유저로 로그인 시도시
    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<?> handleInternalAuthenticationServiceException(final InternalAuthenticationServiceException ex) {
        ResultDto<Object> response = ResultDto.res(
                HttpStatus.NOT_FOUND.value(),
                "등록되지 않은 아이디이거나 아이디 또는 비밀번호를 잘못 입력했습니다."
        );

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        ResultDto<Object> response = ResultDto.res(
                HttpStatus.BAD_REQUEST.value(),
                // Annotation에 설정된 메시지 추출 후 담기
                ex.getBindingResult().getAllErrors().get(0).getDefaultMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<?> handleMissingServletRequestParameterException(MissingServletRequestParameterException ex) {
        ResultDto<Object> response = ResultDto.res(
                HttpStatus.BAD_REQUEST.value(),
                "잘못된 형식의 요청입니다."
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex) {
        ResultDto<Object> response = ResultDto.res(
                HttpStatus.FORBIDDEN.value(),
                "해당 권한으로는 이 API를 호출할 수 없습니다."
        );
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({ MethodArgumentTypeMismatchException.class, DateTimeParseException.class })
    public ResponseEntity<?> handleDateParsingException(Exception ex) {
        log.info(ex.getMessage());
        ResultDto<Object> response = ResultDto.res(
                HttpStatus.BAD_REQUEST.value(),
                "유효하지 않은 날짜 형식입니다."
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(final RuntimeException ex) {
        ResultDto<Object> response = ResultDto.res(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(final Exception ex) {
        log.info(ex.getMessage());
        ResultDto<Object> response = ResultDto.res(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
