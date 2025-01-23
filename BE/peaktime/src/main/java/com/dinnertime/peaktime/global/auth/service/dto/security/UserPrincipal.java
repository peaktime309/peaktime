package com.dinnertime.peaktime.global.auth.service.dto.security;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserPrincipal implements UserDetails {

    private long userId;
    private String password;
    private String authority; // "root" or "child"

    @Builder
    private UserPrincipal(long userId, String password, String authority) {
        this.userId = userId;
        this.password = password;
        this.authority = authority;
    }

    public static UserPrincipal createUserPrincipal(long userId, String password, String authority) {
        return UserPrincipal.builder()
                .userId(userId)
                .password(password)
                .authority(authority)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return "";
    }
}
