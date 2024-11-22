package com.dinnertime.peaktime.global.auth.filter;

import com.dinnertime.peaktime.domain.user.service.UserService;
import com.dinnertime.peaktime.global.auth.service.JwtService;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends GenericFilterBean {

    private final JwtService jwtService;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        log.info("JwtFilter START");
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String jwt = null;

        // 1. Request Header에서 Access Token 추출
        String bearerToken = httpServletRequest.getHeader("Authorization");
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            jwt = bearerToken.substring(7);
        }

        // 2. Access Token 유효성 검증 (위변조, 만료 등)
        if((!StringUtils.hasText(jwt)) || (!jwtService.validateToken(jwt))) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        // 3. Access Token에서 User PK와 Authority 정보 추출
        long userId = jwtService.getUserId(jwt);
        String authority = jwtService.getAuthority(jwt);

        log.info(authority);

        // 4. SecurityContextHolder의 Authentication의 Principal에 저장할 객체 생성 (개발자용)
        UserPrincipal userPrincipal = UserPrincipal.createUserPrincipal(userId, null, authority);

        // 5. SecurityContextHolder의 Authentication의 Authorities에 저장할 객체 생성 (필터용)
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(authority));

        // 6. 실제 등록할 수 있는 Authentication 타입의 객체 생성 (UsernamePasswordAuthenticationToken은 Principal, Credentials, Authorities 필드 존재)
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, authorities);

        // 7. 이후의 인증 절차에서 세션 관련 정보나 IP 정보를 사용 가능
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));

        // 8. 등록하기
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 9. 다음 필터로 요청
        filterChain.doFilter(servletRequest, servletResponse);

    }
}
