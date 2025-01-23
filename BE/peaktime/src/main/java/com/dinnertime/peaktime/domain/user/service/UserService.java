package com.dinnertime.peaktime.domain.user.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.user.service.dto.request.*;
import com.dinnertime.peaktime.domain.user.service.dto.response.GetProfileResponse;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.AuthUtil;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final RedisService redisService;
    private final UserRepository userRepository;

    // 프로필 조회
    public GetProfileResponse getProfile(UserPrincipal userPrincipal) {
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return GetProfileResponse.createGetProfileResponse(user.getUserLoginId(), user.getNickname(), user.getEmail());
    }

    // 닉네임 변경
    @Transactional
    public void updateNickname(UpdateNicknameRequest updateNicknameRequest, UserPrincipal userPrincipal) {
        // 1. 닉네임 형식 검사
        if(!AuthUtil.checkFormatValidationNickname(updateNicknameRequest.getNickname())) {
            throw new CustomException(ErrorCode.INVALID_NICKNAME_FORMAT);
        }
        // 2. 유저 정보 불러오기
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        // 3. 현재 유저의 닉네임과 비교하기
        if(updateNicknameRequest.getNickname().equals(user.getNickname())) {
            throw new CustomException(ErrorCode.DUPLICATED_NICKNAME);
        }
        // 4. 유저 엔티티에 새로운 닉네임 집어넣기
        user.setNickname(updateNicknameRequest.getNickname());
        // 5. Save User
        userRepository.save(user);
    }

    // 회원탈퇴
    @Transactional
    public void deleteUser(UserPrincipal userPrincipal) {
        // 1. root 계정에게 종속된 child 계정 전부 탈퇴처리
        userRepository.updateIsDeleteByRootUserId(userPrincipal.getUserId());
        // 2. 이어서 root 계정 탈퇴처리
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.deleteUser();
        userRepository.save(user);
        // 3. root 계정과 이 root 계정에 종속된 child 계정의 User PK를 추출하여 Redis에 저장된 Refresh Token 삭제하기 (고도화)
    }

    // 비밀번호 변경
    @Transactional
    public void updatePassword(UpdatePasswordRequest updatePasswordRequest, UserPrincipal userPrincipal) {
        // 1. 비밀번호 형식 검사
        if(!AuthUtil.checkFormatValidationPassword(updatePasswordRequest.getNewPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD_FORMAT);
        }
        // 2. 비밀번호 일치 검사
        if(!updatePasswordRequest.getNewPassword().equals(updatePasswordRequest.getConfirmNewPassword())) {
            throw new CustomException(ErrorCode.NOT_EQUAL_PASSWORD);
        }
        // 3. 현재 유저 엔티티 불러오기
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        // 4. 비밀번호 중복 검사 (현재 유저의 비밀번호와 비교하기) -> matches 메서드는 첫 번째 인자로 평문 비밀번호 필요
        if(passwordEncoder.matches(updatePasswordRequest.getNewPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.DUPLICATED_PASSWORD);
        }
        // 5. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(updatePasswordRequest.getNewPassword());
        // 6. 유저 엔티티에 새로운 비밀번호 집어넣기
        user.setPassword(encodedPassword);
        // 7. Save User
        userRepository.save(user);
    }

    // 이메일 변경
    @Transactional
    public void updateEmail(UpdateEmailRequest updateEmailRequest, UserPrincipal userPrincipal) {
        // 1. 이메일 형식 검사
        if(!AuthUtil.checkFormatValidationEmail(updateEmailRequest.getEmail())) {
            throw new CustomException(ErrorCode.INVALID_EMAIL_FORMAT);
        }
        // 2. 이메일 소문자로 변환
        String lowerEmail = AuthUtil.convertUpperToLower(updateEmailRequest.getEmail());
        // 3. 이메일 중복 검사
        if(this.checkDuplicateEmail(lowerEmail)) {
            throw new CustomException(ErrorCode.DUPLICATED_EMAIL);
        }
        // 4. 현재 유저 엔티티 불러오기
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        // 5. 현재 이메일 주소와 비교하기 -> 둘 다 소문자 변환 완료
        if(lowerEmail.equals(user.getEmail())) {
            throw new CustomException(ErrorCode.SAME_EMAIL);
        }
        // 6. 이메일 인증여부 검사
        String redisEmailAuthentication = redisService.getEmailAuthentication(lowerEmail);
        if(redisEmailAuthentication == null || !redisEmailAuthentication.equals("Authenticated")) {
            throw new CustomException(ErrorCode.INVALID_EMAIL_AUTHENTICATION);
        }
        // 7. 유저 엔티티에 새로운 이메일 집어넣기
        user.setEmail(lowerEmail);
        // 8. Save User
        userRepository.save(user);
        // 9. Redis에서 emailAuthentication prefix 데이터 삭제
        redisService.removeEmailAuthentication(lowerEmail);
    }

    // 비밀번호 검증
    @Transactional(readOnly = true)
    public void checkPassword(CheckPasswordRequest checkPasswordRequest, UserPrincipal userPrincipal) {
        // 1. 유저 정보 불러오기
        User user = userRepository.findByUserId((userPrincipal.getUserId()))
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        // 2. 비밀번호가 일치하는지 확인하기
        if(!passwordEncoder.matches(checkPasswordRequest.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_ROOT_PASSWORD);
        }
    }

    // 회원정보 관리 페이지 접근 권한 검사
    @Transactional(readOnly = true)
    public void allowSettings(AllowSettingsRequest allowSettingsRequest, UserPrincipal userPrincipal) {
        // 1. 유저 정보 불러오기
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        // 2. Root 계정인지 Child 계정인지 판별하기
        if(!user.getIsRoot()) {
            throw new CustomException(ErrorCode.SETTINGS_FOR_ROOT);
        }
        // 3. 클라이언트로부터 받은 비밀번호 형식 검사
        if(!AuthUtil.checkFormatValidationPassword(allowSettingsRequest.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD_FORMAT);
        }
        // 4. 비밀번호가 일치하는지 확인하기
        if(!passwordEncoder.matches(allowSettingsRequest.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_ROOT_PASSWORD);
        }
    }

    // 이메일 중복 검사 (이메일 주소로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateEmail(String lowerEmail) {
        return userRepository.findByEmail(lowerEmail).isPresent();
    }

    @Transactional(readOnly = true)
    public User getUser(Long userId) {
        return userRepository.findByUserId(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

}
