package com.dinnertime.peaktime.domain.summary.service;

import com.dinnertime.peaktime.domain.memo.service.dto.response.MemoWrapperResponseDto;
import com.dinnertime.peaktime.domain.summary.service.dto.request.SaveSummaryRequestDto;
import com.dinnertime.peaktime.domain.summary.service.dto.response.CreateSummaryResponseDto;
import com.dinnertime.peaktime.domain.summary.service.dto.response.SummaryDetailResponseDto;
import com.dinnertime.peaktime.domain.summary.service.dto.response.SummaryWrapperResponseDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.service.UserService;
import com.dinnertime.peaktime.global.util.RedisService;
import com.dinnertime.peaktime.global.util.chatgpt.ChatGPTService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class SummaryFacade {

    private final SummaryService summaryService;
    private final ChatGPTService chatGPTService;
    private final UserService userService;
    private final RedisService redisService;

    //요약 생성
    public CreateSummaryResponseDto createSummary(SaveSummaryRequestDto requestDto, Long userId){

        //유저 찾기
        User user = userService.getUser(userId);

        //gpt 생성
        String GPTContent = chatGPTService.getGPTResult(requestDto, userId);
        
        //요약 내용 저장
        summaryService.createSummary(requestDto, GPTContent, user);

        Integer gptCount = redisService.getGPTcount(userId);

        return CreateSummaryResponseDto.createSummaryResponseDto(gptCount);
    }

    //요약 삭제
    public void deleteSummary(Long summaryId){
        summaryService.deleteSummary(summaryId);
    }

    //요약 리스트 조회
    public SummaryWrapperResponseDto getSummaryList(Long userId, int page) {
        return summaryService.getSummaryList(userId, page);
    }

    //요약 상세 조회
    public SummaryDetailResponseDto getSummaryDetail(Long summaryId) {
        return summaryService.getSummaryDetail(summaryId);
    }
}
