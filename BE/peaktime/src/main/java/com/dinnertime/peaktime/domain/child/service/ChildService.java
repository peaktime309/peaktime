package com.dinnertime.peaktime.domain.child.service;

import com.dinnertime.peaktime.domain.child.service.dto.request.ChangeChildPasswordRequestDto;
import com.dinnertime.peaktime.domain.child.service.dto.request.CreateChildRequestDto;
import com.dinnertime.peaktime.domain.child.service.dto.request.UpdateChildRequestDto;
import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.statistic.entity.Statistic;
import com.dinnertime.peaktime.domain.statistic.repository.StatisticRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.user.service.UserService;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.auth.service.AuthService;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChildService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final GroupRepository groupRepository;
    private final StatisticRepository statisticRepository;

    // 초기화 비밀번호 설정
    private static final String initPassword = "000000";

    @Transactional
    public void createChild(CreateChildRequestDto requestDto){

        // 1. 해당 그룹의 인원이 30명 미만인지 확인
        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(requestDto.getGroupId())
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        Long userCount = userGroupRepository.countAllByGroup_groupId(requestDto.getGroupId());
        if(userCount >= 30) {
            throw new CustomException(ErrorCode.FAILED_CREATE_CHILD_USER);
        }

        // 2. 아이디 형식 확인
        if(!AuthUtil.checkFormatValidationUserLoginId(requestDto.getChildLoginId())){
            throw new CustomException(ErrorCode.INVALID_USER_LOGIN_ID_FORMAT);
        }

        // 3. 아이디 소문자 변환
        String childLoginId = AuthUtil.convertUpperToLower(requestDto.getChildLoginId());

        // 4. 아이디 중복 확인
        if(this.checkDuplicateUserLoginId(childLoginId)){
            throw new CustomException(ErrorCode.DUPLICATED_USER_LOGIN_ID);
        };

        // 5. 닉네임 형식 확인
        if(!AuthUtil.checkFormatValidationNickname(requestDto.getChildNickname())){
            throw new CustomException(ErrorCode.INVALID_NICKNAME_FORMAT);
        }

        // 6. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(initPassword);

        // 7. 유저 테이블 저장
        User user = User.createChildUser(requestDto.getChildLoginId(), encodedPassword, requestDto.getChildNickname());
        userRepository.save(user);

        //8. 통계 테이블 저장
        Statistic statistic = Statistic.createFirstStatistic(user);
        statisticRepository.save(statistic);

        // 9. 유저 그룹 테이블 저장
        UserGroup userGroup = UserGroup.createUserGroup(user, group);
        userGroupRepository.save(userGroup);
    }

    @Transactional
    public void deleteChild(Long childId){
        // 1. 자식 계정 확인
        User childUser = this.getChildUser(childId);

        // 2. user_group 테이블 삭제
        UserGroup userGroup = this.getChildUserGroup(childId);

        userGroupRepository.delete(userGroup);

        // 3. user 테이블 수정 및 저장
        childUser.deleteUser();
        userRepository.save(childUser);
    }

    @Transactional
    public void updateChild(Long childId, UpdateChildRequestDto requestDto){

        // 1. 유저 테이블 조회
        User childUser = this.getChildUser(childId);

        // 2. 유저그룹 테이블 조회
        UserGroup userGroup = this.getChildUserGroup(childId);

        // 3. 그룹이 변경될 경우
        if(!userGroup.getGroup().getGroupId().equals(requestDto.getGroupId())){
            // 4. 그룹 조회
            Group group = groupRepository.findByGroupIdAndIsDeleteFalse(requestDto.getGroupId())
                    .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

            // 5. 해당 그룹의 인원이 30명 미만인지 확인
            Long userCount = userGroupRepository.countAllByGroup_groupId(requestDto.getGroupId());
            if(userCount >= 30) {
                throw new CustomException(ErrorCode.FAILED_CREATE_CHILD_USER);
            }

            // 6. 유저그룹 수정 및 저장
            userGroup.changeUserGroup(group);
            userGroupRepository.save(userGroup);
        }

        // 7. 유저 닉네임이 변경될 경우
        if(!childUser.getNickname().equals(requestDto.getChildNickName())){
            // 8. 변경 닉네임이 형식에 맞는지 확인
            if(!AuthUtil.checkFormatValidationNickname(requestDto.getChildNickName())){
                throw new CustomException(ErrorCode.INVALID_NICKNAME_FORMAT);
            }

            // 9. 유저 수정 후 저장
            childUser.updateNickname(requestDto.getChildNickName());
            userRepository.save(childUser);
        }
    }

    @Transactional
    public void changeChildPassword(Long childId, ChangeChildPasswordRequestDto requestDto){
        // 1. 자식 계정 조회
        User childUser = this.getChildUser(childId);

        // 2. 패스워드 형식 확인
        if(!AuthUtil.checkFormatValidationPassword(requestDto.getChildPassword())){
            throw new CustomException(ErrorCode.INVALID_PASSWORD_FORMAT);
        }

        // 3. 패스워드 일치 확인
        if(!requestDto.getChildPassword().equals(requestDto.getChildConfirmPassword())){
            throw new CustomException(ErrorCode.NOT_EQUAL_PASSWORD);
        }
        // 4. 패스워드 암호화
        String encodedPassword = passwordEncoder.encode(requestDto.getChildPassword());

        // 5. 수정 후 저장
        childUser.updatePassword(encodedPassword);
        userRepository.save(childUser);
    }

    @Transactional
    public void initChildPassword(Long childId){
        // 1. 자식 계정 조회
        User childUser = this.getChildUser(childId);

        // 2. 초기화 비밀번호 설정
        String encodedPassword = passwordEncoder.encode(initPassword);

        // 3. 저장
        childUser.updatePassword(encodedPassword);
        userRepository.save(childUser);
    }

    // 아이디 중복 검사 (유저 로그인 아이디로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateUserLoginId(String userLoginId) {
        return userRepository.findByUserLoginId(userLoginId).isPresent();
    }

    // 자식 계정 조회
    private User getChildUser(Long childId){
        return userRepository.findByUserIdAndIsDeleteFalseAndIsRootFalse(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    // 유저 그룹 테이블 조회
    private UserGroup getChildUserGroup(Long childId){
        return userGroupRepository.findByUser_UserId(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }
}
