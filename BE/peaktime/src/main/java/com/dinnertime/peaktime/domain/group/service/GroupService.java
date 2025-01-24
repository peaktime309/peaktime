package com.dinnertime.peaktime.domain.group.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.group.service.dto.request.GroupCreateRequestDto;
import com.dinnertime.peaktime.domain.group.service.dto.request.GroupPutRequestDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupItemResponseDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.ChildItemResponseDto;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupListResponseDto;
import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.timer.repository.TimerRepository;
import com.dinnertime.peaktime.domain.timer.service.dto.response.TimerItemResponseDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;
    private final TimerRepository timerRepository;
    private final UserRepository userRepository;
    private final PresetRepository presetRepository;

    @Transactional
    public GroupListResponseDto getGroupListResponseDto(Long userId) {
        List<GroupItemResponseDto> groupList = getGroupList(userId);

        return GroupListResponseDto.createGroupListResponseDto(groupList);
    }

    @Transactional
    public List<GroupItemResponseDto> getGroupList(Long userId) {
        List<Group> groupList = groupRepository.findByUser_UserIdAndIsDeleteFalseOrderByTitleAsc(userId);

        return groupList.stream()
                .map(groupItem -> GroupItemResponseDto.createGroupItemResponseDto(
                        groupItem.getGroupId(),
                        groupItem.getTitle(),
                        getChildList(groupItem)
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ChildItemResponseDto> getChildList(Group group) {
        List<UserGroup> userGroups = userGroupRepository.findAllByGroup(group);

        return userGroups.stream()
                .sorted(Comparator.comparing(userGroup -> userGroup.getUser().getNickname())) // nickname 오름차순 정렬
                .map(userGroup -> {
                    User user = userGroup.getUser();

                    return ChildItemResponseDto.createChildItemResponseDto(
                            user.getUserId(),
                            user.getUserLoginId(),
                            user.getNickname()
                    );
                })
                .collect(Collectors.toList());
    }


    // 개별 그룹 조회
    @Transactional
    public GroupDetailResponseDto getGroupDetail(Long groupId) {
        // 그룹 조회
        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        // 타이머 리스트 조회
        List<TimerItemResponseDto> timerList = timerRepository.findByGroup_GroupId(groupId)
                .stream()
                .map(TimerItemResponseDto::createTimeItemResponseDto)
                .collect(Collectors.toList());

        return GroupDetailResponseDto.createGroupDetailResponseDto(group, timerList);
    }

    // 그룹 생성
    @Transactional
    public void postGroup(Long userId, GroupCreateRequestDto requestDto) {
        User user = userRepository.findByUserIdAndIsDeleteFalse(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<Group> groupListByUserId = groupRepository.findByUser_UserIdAndIsDeleteFalse(userId);

        // 그룹 수 확인
        if (groupListByUserId.size() >= 5) {
            throw new CustomException(ErrorCode.FAILED_CREATE_GROUP);
        }

        // 그룹명 중복 확인
        if (groupListByUserId.stream().anyMatch(group -> group.getTitle().equals(requestDto.getTitle()))) {
            throw new CustomException(ErrorCode.GROUP_NAME_ALREADY_EXISTS);
        }

        Preset preset = presetRepository.findByPresetId(requestDto.getPresetId())
                .orElseThrow(() -> new CustomException(ErrorCode.PRESET_NOT_FOUND));

        // 생성
        Group group = Group.createGroup(requestDto.getTitle(), preset, user);

        groupRepository.save(group);
    }

    // 그룹 수정
    @Transactional
    public void putGroup(Long userId, Long groupId, GroupPutRequestDto requestDto) {

        // 그룹 조회
        Group groupSelected = groupRepository.findByGroupIdAndIsDeleteFalse(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        // 그룹명 중복 검사
        Long countTitle = groupRepository.countByUser_UserIdAndIsDeleteFalseAndTitleAndGroupIdNot(userId, requestDto.getTitle(), groupId);
        if (countTitle > 0) {
            throw new CustomException(ErrorCode.GROUP_NAME_ALREADY_EXISTS);
        }

        // 그룹 정보 업데이트
        // 아무것도 바뀌지 않았다면 return
        if (groupSelected.getTitle().equals(requestDto.getTitle()) && groupSelected.getPreset().getPresetId().equals(requestDto.getPresetId())) return;

        // title, preset 중 하나 이상 바뀌었다면 실행
        Preset preset = presetRepository.findByPresetId(requestDto.getPresetId())
                    .orElseThrow(() -> new CustomException(ErrorCode.PRESET_NOT_FOUND));

        groupSelected.updateGroup(requestDto.getTitle(), preset);
        groupRepository.save(groupSelected);
    }

    // 그룹 삭제
    @Transactional
    public void deleteGroup(Long groupId) {
        Group groupSelected = groupRepository.findByGroupIdAndIsDeleteFalse(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        // 그룹에 속해있는 child_user를 검색해서 삭제하기
        userRepository.updateIsDeleteByGroupId(groupId);
        
        groupSelected.deleteGroup();
        groupRepository.save(groupSelected);
    }
}
