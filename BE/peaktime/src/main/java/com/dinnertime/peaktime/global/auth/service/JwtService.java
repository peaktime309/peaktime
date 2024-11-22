package com.dinnertime.peaktime.global.auth.service;

import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtService implements InitializingBean {

    // JWT 만료 시간
    @Value("${jwt.token.access-expire-time}")
    private int ACCESSTOKEN_EXPIRE_TIME;
    @Value("${jwt.token.refresh-expire-time}")
    private int REFRESHTOKEN_EXPIRE_TIME;

    // JWT Signature 생성에 사용되는 문자열(서버만 알고 있는 비밀번호) -> a
    @Value("${jwt.token.secret-key}")
    private String SECRET_KEY;

    // JWT 서명에 사용되는 SecretKey 객체 -> b
    private SecretKey secretKey;

    @Override
    public void afterPropertiesSet() {
        this.secretKey = buildKey();
    }

    // a를 b로 변환하는 메서드
    private SecretKey buildKey() {
        byte[] decodedKeyValue = Base64.getDecoder().decode(SECRET_KEY); // Decoder 사용
        return Keys.hmacShaKeyFor(decodedKeyValue);
    }

    // Access Token 생성
    public String createAccessToken(long userId, String authority) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claim("userId", userId)
                .claim("authority", authority)
                .signWith(secretKey)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(ACCESSTOKEN_EXPIRE_TIME)))
                .compact();
    }

    // Refresh Token 생성
    public String createRefreshToken(long userId, String authority) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claim("userId", userId)
                .claim("authority", authority)
                .signWith(secretKey)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(REFRESHTOKEN_EXPIRE_TIME)))
                .compact();
    }

    // 만료시점을 지정할 수 있는 Refresh Token 생성
    public String createRefreshTokenWithExp(long userId, String authority, Date expirationTime) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claim("userId", userId)
                .claim("authority", authority)
                .signWith(secretKey)
                .setIssuedAt(Date.from(now))
                .setExpiration(expirationTime)
                .compact();
    }

    // Cookie에 Refresh Token 담기
    public void addRefreshTokenToCookie(HttpServletResponse httpServletResponse, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        // 어느 페이지에서도 유효
        cookie.setPath("/");
        cookie.setMaxAge(REFRESHTOKEN_EXPIRE_TIME);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        httpServletResponse.addCookie(cookie);
    }

    // 클라이언트의 Refresh Token 삭제
    public void letRefreshTokenRemoved(HttpServletResponse httpServletResponse) {
        Cookie cookie = new Cookie("refresh_token", "Arbitrary");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        httpServletResponse.addCookie(cookie);
    }

    // JWT 유효성 검사
    public boolean validateToken(String token) {
        try {
            // 유효한 토큰이라면 Claims 객체를 추출 가능
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return true;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
    }

    // JWT에서 User PK 추출
    public long getUserId(String token) {
        Claims claims = this.getClaims(token);
        Number userId = (Number) claims.get("userId");
        return userId.longValue();
    }

    // JWT에서 Authority 추출
    public String getAuthority(String token) {
        Claims claims = this.getClaims(token);
        return (String) claims.get("authority");
    }

    // JWT에서 만료시간 추출
    public Date getExpirationTime(String token) {
        Claims claims = this.getClaims(token);
        return claims.getExpiration();
    }

    // JWT에서 Claims 추출
    private Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
    }

    // 클라이언트의 요청에서 Refresh Token 추출하기
    public String extractRefreshToken(HttpServletRequest httpServletRequest) {
        Cookie[] cookies = httpServletRequest.getCookies();
        if(cookies == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        for(Cookie cookie : cookies) {
            if(cookie.getName().equals("refresh_token")) {
                return cookie.getValue();
            }
        }
        throw new CustomException(ErrorCode.UNAUTHORIZED);
    }

}
