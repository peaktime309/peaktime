package com.dinnertime.peaktime.global.auth.service.dto.security;

import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. 클라이언트에게 전달받은 아이디가 존재하는지 확인
        User user = userRepository.findByUserLoginIdAndIsDeleteFalse(username)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_LOGIN_PROCESS));
        // 2. 해당 유저의 권한 파악
        if(user.getIsRoot()) {
            return UserPrincipal.createUserPrincipal(user.getUserId(), user.getPassword(), "root");
        }
        return UserPrincipal.createUserPrincipal(user.getUserId(), user.getPassword(), "child");
    }
}
