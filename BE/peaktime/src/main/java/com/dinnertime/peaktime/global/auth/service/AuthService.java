package com.dinnertime.peaktime.global.auth.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.statistic.entity.Statistic;
import com.dinnertime.peaktime.domain.statistic.repository.StatisticRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.global.auth.service.dto.request.*;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.auth.service.dto.response.IsDuplicatedResponse;
import com.dinnertime.peaktime.global.auth.service.dto.response.LoginResponse;
import com.dinnertime.peaktime.global.auth.service.dto.response.ReissueResponse;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.EmailServerException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.AuthUtil;
import com.dinnertime.peaktime.global.util.EmailService;
import com.dinnertime.peaktime.global.util.RedisService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.*;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RedisService redisService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PresetRepository presetRepository;
    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;
    private final StatisticRepository statisticRepository;

    // 회원가입
    @Transactional
    public void signup(SignupRequest signupRequest) {
        // 1-1. 아이디 형식 검사
        if(!AuthUtil.checkFormatValidationUserLoginId(signupRequest.getUserLoginId())) {
            throw new CustomException(ErrorCode.INVALID_USER_LOGIN_ID_FORMAT);
        }
        // 1-2. 아이디 중복 검사
        if(this.checkDuplicateUserLoginId(signupRequest.getUserLoginId())) {
            throw new CustomException(ErrorCode.DUPLICATED_USER_LOGIN_ID);
        }
        // 2-1. 비밀번호 형식 검사
        if(!AuthUtil.checkFormatValidationPassword(signupRequest.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD_FORMAT);
        }
        // 2-2. 비밀번호 일치 검사
        if(!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            throw new CustomException(ErrorCode.NOT_EQUAL_PASSWORD);
        }
        // 2-3. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());
        // 3. 닉네임 형식 검사
        if(!AuthUtil.checkFormatValidationNickname(signupRequest.getNickname())) {
            throw new CustomException(ErrorCode.INVALID_NICKNAME_FORMAT);
        }
        // 4-1. 이메일 형식 검사
        if(!AuthUtil.checkFormatValidationEmail(signupRequest.getEmail())) {
            throw new CustomException(ErrorCode.INVALID_EMAIL_FORMAT);
        }
        // 4-2. 이메일 소문자로 변환
        String lowerEmail = AuthUtil.convertUpperToLower(signupRequest.getEmail());
        // 4-3. 이메일 중복 검사
        if(this.checkDuplicateEmail(lowerEmail)) {
            throw new CustomException(ErrorCode.DUPLICATED_EMAIL);
        }
        // 4-4. 이메일 인증여부 검사
        String redisEmailAuthentication = redisService.getEmailAuthentication(lowerEmail);
        if(redisEmailAuthentication == null || !redisEmailAuthentication.equals("Authenticated")) {
            throw new CustomException(ErrorCode.INVALID_EMAIL_AUTHENTICATION);
        }
        // 5. Create User Entity
        User user = User.createRootUser(
                signupRequest.getUserLoginId(),
                encodedPassword,
                signupRequest.getNickname(),
                lowerEmail
        );
        // 6. Save User
        userRepository.save(user);
        //6-1. Save statistic
        Statistic statistic = Statistic.createFirstStatistic(user);
        statisticRepository.save(statistic);
        // 7. Redis에서 emailAuthenticaion prefix 데이터 삭제
        redisService.removeEmailAuthentication(lowerEmail);
        // 8. Create Block Website Array For Default Preset
        List<String> blockWebsiteList;
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("DistractionsWebsites.txt")) {
            if (inputStream == null) {
                throw new CustomException(ErrorCode.FILE_NOT_FOUND);
            }
            blockWebsiteList = new BufferedReader(new InputStreamReader(inputStream))
                    .lines()
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_NOT_FOUND);
        }
        // 9. Create Block Program Array For Default Preset
        List<String> blockProgramList;
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("DistractionsPrograms.txt")) {
            if (inputStream == null) {
                throw new CustomException(ErrorCode.FILE_NOT_FOUND);
            }
            blockProgramList = new BufferedReader(new InputStreamReader(inputStream))
                    .lines()
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_NOT_FOUND);
        }

        // 10. Create Default Preset
        Preset preset = Preset.createDefaultPreset(blockWebsiteList, blockProgramList, user);
        // 11. Save Preset
        presetRepository.save(preset);
    }

    // 유저 로그인 아이디 중복 조회
    public IsDuplicatedResponse isDuplicatedUserLoginId(String userLoginId) {
        // 1. 아이디 형식 검사
        if(!AuthUtil.checkFormatValidationUserLoginId(userLoginId)) {
            throw new CustomException(ErrorCode.INVALID_USER_LOGIN_ID_FORMAT);
        }
        // 2. 아이디 중복 검사
        boolean isDuplicated = this.checkDuplicateUserLoginId(userLoginId);
        return IsDuplicatedResponse.createIsDuplicatedResponse(isDuplicated);
    }

    // 이메일 중복 조회
    public IsDuplicatedResponse isDuplicatedEmail(String email) {
        // 1. 이메일 형식 검사
        if(!AuthUtil.checkFormatValidationEmail(email)) {
            throw new CustomException(ErrorCode.INVALID_EMAIL_FORMAT);
        }
        // 2. 이메일 소문자로 변환
        String lowerEmail = AuthUtil.convertUpperToLower(email);
        // 3. 이메일 중복 검사
        boolean isDuplicated = this.checkDuplicateEmail(lowerEmail);
        return IsDuplicatedResponse.createIsDuplicatedResponse(isDuplicated);
    }

    // 로그인
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse httpServletResponse) {
        // 1. loadUserByUsername 메서드 호출
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUserLoginId(),
                        loginRequest.getPassword()
                )
        );
        // 2. 현재 SecurityContextHolder의 Authentication의 Principal 불러오기
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        // 3. PK와 Authority 정보를 추출하여 JWT 생성
        String accessToken = jwtService.createAccessToken(userPrincipal.getUserId(), userPrincipal.getAuthority());
        String refreshToken = jwtService.createRefreshToken(userPrincipal.getUserId(), userPrincipal.getAuthority());
        // 4. Refresh Token을 Redis에 저장
        redisService.saveRefreshToken(userPrincipal.getUserId(), refreshToken);
        // 5. Refresh Token을 Cookie에 담아서 클라이언트에게 전송
        jwtService.addRefreshTokenToCookie(httpServletResponse, refreshToken);
        // 6. LoginResponse 객체 생성하여 반환
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_LOGIN_PROCESS));
        if(user.getIsRoot()) {
            return LoginResponse.createLoginResponse(accessToken, true, null, user.getNickname());
        }
        UserGroup userGroup = userGroupRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_LOGIN_PROCESS));
        return LoginResponse.createLoginResponse(accessToken, false, userGroup.getGroup().getGroupId(), user.getNickname());
    }

    // Reissue JWT
    @Transactional
    public ReissueResponse reissue(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        // 1. 클라이언트의 요청에서 Refresh Token 추출하기
        String refreshToken = jwtService.extractRefreshToken(httpServletRequest);
        // 2. Refresh Token 유효성 검증 (위변조, 만료 등) -> 유효하지 않으면 401 예외 던지기
        if((!StringUtils.hasText(refreshToken)) || (!jwtService.validateToken(refreshToken))) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        // 3. Redis에 존재하는 Refresh Token과 일치하는지 확인하기 -> 일치하지 않으면 401 예외 던지기
        long userId = jwtService.getUserId(refreshToken);
        String redisRefreshToken = redisService.getRefreshToken(userId);
        if(!refreshToken.equals(redisRefreshToken)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        // 4. 새 Access Token과 새 Refresh Token을 생성하기 위한 정보를 기존 Refresh Token에서 추출하기 (userId, Authority, 만료시간)
        String authority = jwtService.getAuthority(refreshToken);
        Date expirationTime = jwtService.getExpirationTime(refreshToken);
        // 5. 새 Access Token과 새 Refresh Token 생성
        String newAccessToken = jwtService.createAccessToken(userId, authority);
        String newRefreshToken = jwtService.createRefreshTokenWithExp(userId, authority, expirationTime);
        // 6. 새 Refresh Token을 Redis에 저장 (기존 Refresh Token 반드시 덮어쓰기)
        redisService.saveRefreshToken(userId, newRefreshToken);
        // 7. 새 Refresh Token을 Cookie에 담아서 클라이언트에게 전송
        jwtService.addRefreshTokenToCookie(httpServletResponse, newRefreshToken);
        // 8. ReissueResponse 객체 생성하여 반환 (새 Access Token을 Response Body에 담아서 클라이언트에게 전송)
        return ReissueResponse.createReissueResponse(newAccessToken);
    }

    // 로그아웃
    @Transactional
    public void logout(LogoutRequest logoutRequest, UserPrincipal userPrincipal, HttpServletResponse httpServletResponse) {
        // 1. 클라이언트의 요청에서 rootUserPassword 추출하기
        String rootUserPassword = logoutRequest.getRootUserPassword();
        // 2. DB에서 비밀번호 가져오기
        String rootUserPasswordOnDatabase = this.getRootUserPasswordOnDatabase(userPrincipal);
        // 3. 비밀번호 비교하기 -> matches 메서드는 첫 번째 인자로 평문 비밀번호 필요
        if(!passwordEncoder.matches(rootUserPassword, rootUserPasswordOnDatabase)) {
            throw new CustomException(ErrorCode.INVALID_ROOT_PASSWORD);
        }
        // 4. Redis에서 해당 유저의 Refresh Token 삭제
        redisService.removeRefreshToken(userPrincipal.getUserId());
        // 5. 클라이언트의 Refresh Token 삭제
        jwtService.letRefreshTokenRemoved(httpServletResponse);
    }

    // 인증 코드 전송
    @Transactional
    public void sendCode(SendCodeRequest sendCodeRequest) {
        // 1. 인증 코드 생성
        String code = this.generateCode();
        // 2. 클라이언트에게 받은 이메일 주소로 인증 코드 보내기
        String lowerEmail = AuthUtil.convertUpperToLower(sendCodeRequest.getEmail());
        emailService.sendCode(lowerEmail, code);
        // 3. Redis에 Key가 emailCode라는 prefix와 이메일 주소(소문자)로 이루어져 있고, Value가 랜덤 인증 코드인 정보를 저장하기
        redisService.saveEmailCode(lowerEmail, code);
    }

    // 인증 코드 확인
    @Transactional
    public void checkCode(CheckCodeRequest checkCodeRequest) {
        // 1. 클라이언트의 요청에서 email과 code를 추출하기
        String lowerEmail = AuthUtil.convertUpperToLower(checkCodeRequest.getEmail());
        String code = checkCodeRequest.getCode();
        // 2. 클라이언트에게 받은 email에 대응하는 Redis 데이터를 조회하고 비교하기
        String redisEmailCode = redisService.getEmailCode(lowerEmail);
        if(redisEmailCode == null) {
            throw new CustomException(ErrorCode.EMAIL_CODE_NOT_FOUND);
        }
        if(!code.equals(redisEmailCode)) {
            throw new CustomException(ErrorCode.NOT_EQUAL_EMAIL_CODE);
        }
        // 3. 인증 코드가 일치하면, 우선 Redis에서 필요없는 데이터 삭제하기
        redisService.removeEmailCode(lowerEmail);
        // 4. Redis에 Key가 emailAuthentication이라는 prefix와 이메일 주소(소문자)로 이루어져 있고, Value가 "Authenticated"인 정보를 저장하기 (만료시간 X)
        redisService.saveEmailAuthentication(lowerEmail);
    }

    // 비밀번호 재발급
    @Transactional
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        // 1. 클라이언트의 요청에서 userLoginId과 email 추출하기
        String userLoginId = resetPasswordRequest.getUserLoginId();
        String lowerEmail = AuthUtil.convertUpperToLower(resetPasswordRequest.getEmail());
        // 2. 아이디 형식 검사
        if(!AuthUtil.checkFormatValidationUserLoginId(userLoginId)) {
            throw new CustomException(ErrorCode.INVALID_USER_LOGIN_ID_FORMAT);
        }
        // 3. 아이디 존재 검사
        User user = userRepository.findByUserLoginId(userLoginId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_LOGIN_ID_NOT_FOUND));
        // 4. 루트 계정만 이용 가능
        if(!user.getIsRoot()) {
            throw new CustomException(ErrorCode.NOT_ROOT);
        }
        // 5. 이메일 비교하기
        if(!lowerEmail.equals(user.getEmail())) {
            throw new CustomException(ErrorCode.NOT_EQUAL_EMAIL);
        }
        // 6. 랜덤 비밀번호 생성
        String password = this.generatePassword();
        // 7. 클라이언트에게 받은 이메일 주소로 랜덤 비밀번호 발송
        emailService.sendPassword(lowerEmail, password);
        // 8. 암호화한 랜덤 비밀번호를 유저 엔티티에 집어넣기
        String encodedPassword = passwordEncoder.encode(password);
        user.setPassword(encodedPassword);
        // 9. Save User
        userRepository.save(user);
    }

    // 아이디 중복 검사 (유저 로그인 아이디로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateUserLoginId(String userLoginId) {
        return userRepository.findByUserLoginId(userLoginId).isPresent();
    }

    // 이메일 중복 검사 (이메일 주소로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateEmail(String lowerEmail) {
        return userRepository.findByEmail(lowerEmail).isPresent();
    }

    // 데이터베이스에 존재하는 루트 계정 비밀번호 가져오기
    private String getRootUserPasswordOnDatabase(UserPrincipal userPrincipal) {
        if(userPrincipal.getAuthority().equals("child")) {
            UserGroup userGroup = userGroupRepository.findByUser_UserId(userPrincipal.getUserId())
                    .orElseThrow(() -> new CustomException(ErrorCode.DO_NOT_HAVE_USERGROUP));
            Group group = groupRepository.findByGroupId(userGroup.getGroup().getGroupId())
                    .orElseThrow(() -> new CustomException(ErrorCode.DO_NOT_HAVE_GROUP));
            return group.getUser().getPassword();
        }
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.DO_NOT_HAVE_USER));
        return user.getPassword();
    }

    // 인증 코드 생성
    private String generateCode() {
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder sb = new StringBuilder(6);
        for(int i = 0; i < 6; i++) {
            sb.append(secureRandom.nextInt(10));
        }
        return sb.toString();
    }

    // 비밀번호 생성
    private String generatePassword() {
        String uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercase = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String specialCharacters = "!@#$%^&*";
        List<Character> passwordCharacters = new ArrayList<>();
        SecureRandom secureRandom = new SecureRandom();

        // 각 문자 집합에서 최소 하나씩 추가
        passwordCharacters.add(this.getRandomCharacter(uppercase));
        passwordCharacters.add(this.getRandomCharacter(lowercase));
        passwordCharacters.add(this.getRandomCharacter(digits));
        passwordCharacters.add(this.getRandomCharacter(specialCharacters));

        // 나머지 자리는 네 그룹을 합친 문자열에서 랜덤하게 선택하여 4자리 추가
        String allCharacters = uppercase + lowercase + digits + specialCharacters;
        for(int i = 0; i < 4; i++) {
            passwordCharacters.add(this.getRandomCharacter(allCharacters));
        }

        // 셔플하여 순서 섞기
        Collections.shuffle(passwordCharacters, secureRandom);

        // 리스트를 문자열로 변환하여 반환
        StringBuilder password = new StringBuilder();
        for(Character ch : passwordCharacters) {
            password.append(ch);
        }
        return password.toString();
    }

    // 비밀번호 생성 시 랜덤 문자 선택 메서드
    private char getRandomCharacter(String characters) {
        SecureRandom secureRandom = new SecureRandom();
        int index = secureRandom.nextInt(characters.length());
        return characters.charAt(index);
    }

}
