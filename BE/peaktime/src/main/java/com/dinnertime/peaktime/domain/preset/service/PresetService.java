package com.dinnertime.peaktime.domain.preset.service;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.preset.service.dto.request.AddUrlPresetRequestDto;
import com.dinnertime.peaktime.domain.preset.service.dto.request.SavePresetRequestDto;
import com.dinnertime.peaktime.domain.preset.service.dto.response.PresetResponseDto;
import com.dinnertime.peaktime.domain.preset.service.dto.response.PresetWrapperResponseDto;
import com.dinnertime.peaktime.domain.preset.service.dto.response.SaveUrlPresetResponseDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class PresetService {

    // preset CRUD 처리
    private final PresetRepository presetRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;

    // preset 생성
    @Transactional
    public void createPreset(Long userId, SavePresetRequestDto requestDto) {

        //임시로 1로 고정시키기 추후 수정 userPrincipal.getUserId());
        User user = userRepository.findByUserIdAndIsDeleteFalse(userId).
                orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // userId = 1로 임의 설정
        Preset preset = Preset.createPreset(requestDto, user);

        presetRepository.save(preset);
    }

    // preset 조회
    @Transactional(readOnly = true)
    public PresetWrapperResponseDto getPresets(Long userId) {
        
        User user = userRepository.findByUserId(userId).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
        
        //유저가 자식계정인 경우
        if(!user.getIsRoot()) {
            UserGroup userGroup = userGroupRepository.findByUser_UserId(userId).orElseThrow(
                    () -> new CustomException(ErrorCode.GROUP_NOT_FOUND)
            );

            Preset preset = userGroup.getGroup().getPreset();

            return PresetWrapperResponseDto.buildPresetResponseDto(preset);
        }
        
        List<Preset> presets = presetRepository.findAllByUser_UserIdOrderByPresetIdAsc(userId);

        // userId를 뺀 나머지 데이터 Wrapper해서 적용
        return PresetWrapperResponseDto.buildPresetResponseDto(presets);
    }

    // 특정 프리셋 조회하기
    // preset 조회
    @Transactional(readOnly = true)
    public PresetResponseDto getUniquePreset(Long userId, Long presetId) {

        User user = userRepository.findByUserId(userId).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );

        //유저가 자식계정인 경우
        if(!user.getIsRoot()) {
            UserGroup userGroup = userGroupRepository.findByUser_UserId(userId).orElseThrow(
                    () -> new CustomException(ErrorCode.GROUP_NOT_FOUND)
            );

            Preset preset = userGroup.getGroup().getPreset();

            return PresetResponseDto.createPresetResponse(preset);
        }

        // 루트 계정인 경우 presetId로 접근해서 찾기
        Preset preset = presetRepository.findByPresetId(presetId).orElseThrow(
                () -> new CustomException(ErrorCode.PRESET_NOT_FOUND)
        );

        // userId를 뺀 나머지 데이터 Wrapper해서 적용
        return PresetResponseDto.createPresetResponse(preset);
    }


    // preset 업데이트
    @Transactional
    public void updatePreset(SavePresetRequestDto requestDto, Long presetId) {

        // userId = 1로 임의 설정
        Preset preset = presetRepository.findByPresetId(presetId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRESET_NOT_FOUND));

        preset.updatePreset(requestDto);

        presetRepository.save(preset);
    }

    // 프리셋 삭제
    @Transactional
    public void deletePreset(Long presetId) {
        Preset preset = presetRepository.findByPresetId(presetId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRESET_NOT_FOUND));

        // 그룹에 있을 때 presetId가 존재하는 경우 데이터 무결성 위반 에러 발생함 -> 예외처리 진행
        try{
            presetRepository.delete(preset);
        } catch(DataIntegrityViolationException e){ // 데이터 무결성 위반 exception
            throw new CustomException(ErrorCode.FAILED_DELETE_PRESET_IN_GROUP);
        }

    }

    // ex에서 받아온 특정 웹사이트 프리셋 추가
    @Transactional
    public SaveUrlPresetResponseDto addWebsitePreset(AddUrlPresetRequestDto requestDto, Long presetId) {

        Preset preset = presetRepository.findByPresetId(presetId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRESET_NOT_FOUND));

        boolean isExist = preset.getBlockWebsiteArray().stream()
                .anyMatch(website -> website.equals(requestDto.getUrl()));

        if(isExist) {
            throw new CustomException(ErrorCode.DUPLICATED_URL);
        }

        preset.addWebsitePreset(requestDto);

        presetRepository.save(preset);

        Preset responsePreset = presetRepository.findByPresetId(presetId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRESET_NOT_FOUND));

        return SaveUrlPresetResponseDto.createSaveUrlPresetResponseDto(responsePreset);
    }

}
