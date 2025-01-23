package com.dinnertime.peaktime.domain.summary.service;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import com.dinnertime.peaktime.domain.memo.repository.MemoRepository;
import com.dinnertime.peaktime.domain.summary.entity.Summary;
import com.dinnertime.peaktime.domain.summary.repository.SummaryRepository;
import com.dinnertime.peaktime.domain.summary.service.dto.request.SaveSummaryRequestDto;
import com.dinnertime.peaktime.domain.summary.service.dto.response.SummaryDetailResponseDto;
import com.dinnertime.peaktime.domain.summary.service.dto.response.SummaryResponseDto;
import com.dinnertime.peaktime.domain.summary.service.dto.response.SummaryWrapperResponseDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@RequiredArgsConstructor
@Service
public class SummaryService {

    // 요약 저장, 삭제 구현
    private final SummaryRepository summaryRepository;
    private final MemoRepository memoRepository;

    // 요약 정보 저장 및 업데이트
    @Transactional
    public void createSummary(SaveSummaryRequestDto requestDto, String GPTContent, User user) {
        // insert
        Summary createdSummary = Summary.createSummary(GPTContent, requestDto.getTitle(), user);
        summaryRepository.save(createdSummary);
    }


    @Transactional
    public void deleteSummary(Long summaryId) {

        Summary summary = summaryRepository.findBySummaryId(summaryId)
                .orElseThrow(() -> new CustomException(ErrorCode.SUMMARY_NOT_FOUND));

        summaryRepository.delete(summary);
    }

    @Transactional(readOnly = true)
    public SummaryWrapperResponseDto getSummaryList(Long userId, int page) {
        
        //10개씩 조회
        Pageable pageable = PageRequest.of(page, 10);

        Page<Summary> pageSummaryList = summaryRepository.findAllByUser_UserId(userId, pageable);

        List<SummaryResponseDto> summaryList = pageSummaryList.stream()
                .map(SummaryResponseDto::createSummaryResponseDto)
                .toList();

        return SummaryWrapperResponseDto.createMemoWrapperResponseDto(summaryList, pageSummaryList.isLast());
    }

    @Transactional(readOnly = true)
    public SummaryDetailResponseDto getSummaryDetail(Long summaryId) {
        Summary summary = summaryRepository.findBySummaryId(summaryId).orElseThrow(
                () -> new CustomException(ErrorCode.SUMMARY_NOT_FOUND)
        );

        return SummaryDetailResponseDto.createSummaryDetailResponse(summary);
    }
}
