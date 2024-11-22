package com.dinnertime.peaktime.global.auth.filter;

import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.util.ResultDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
public class ExceptionHandlerFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        } catch (CustomException e) {
            setErrorResponse(e.getErrorCode().getHttpStatus(), httpServletResponse, e);
        } catch (Exception e) {
            setErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, httpServletResponse, e);
        }
    }

    private void setErrorResponse(HttpStatus status, HttpServletResponse httpServletResponse, Throwable ex) throws IOException {

        // response error 헤더 통일 시켜주기
        httpServletResponse.setStatus(status.value());
        httpServletResponse.setContentType("application/json; charset=utf-8");

        ResultDto<Object> errorResponse = ResultDto.res(status.value(), ex.getMessage());

        httpServletResponse.getWriter().write(new ObjectMapper().writeValueAsString(errorResponse));
    }

}
