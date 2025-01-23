package com.dinnertime.peaktime.domain.memo.service;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import com.dinnertime.peaktime.domain.memo.repository.MemoRepository;
import com.dinnertime.peaktime.domain.memo.service.dto.request.SaveMemoRequestDto;
import com.dinnertime.peaktime.domain.memo.service.dto.response.MemoDetailResponseDto;
import com.dinnertime.peaktime.domain.memo.service.dto.response.MemoWrapperResponseDto;
import com.dinnertime.peaktime.domain.summary.repository.SummaryRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.RedisService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class MemoService {

    private final MemoRepository memoRepository;
    private final UserRepository userRepository;
    private final SummaryRepository summaryRepository;

    private final RedisService redisService;
    // 메모 리스트 조회, 삭제 구현

    // 메모 리스트 조회
    // UserPrincipal 임시 설정 -> 구현 후 일괄 수정 예정
    @Transactional(readOnly = true)
    public MemoWrapperResponseDto getMemos(Long userId, int page) {

        Pageable pageable = PageRequest.of(page, 10);

        Page<Memo> memos = memoRepository.findAllByUser_UserId(userId, pageable);

        log.info(memos.toString());

        // redis에서 임시 저장되어있는 요약 횟수 가져오기
        Integer count = redisService.getGPTcount(userId);

        return MemoWrapperResponseDto.createMemoWrapperResponseDto(memos.getContent(), count, memos.isLast());
    }

    // 메모 삭제
    @Transactional
    public void deleteMemo(Long memoId) {
        // summary entity에 summary id와 memoId가 매칭이 된다면(존재한다면) 요약 먼저 제거 후 메모 제거 처리 진행
        Memo memo = memoRepository.findByMemoId(memoId)
                .orElseThrow(()-> new CustomException(ErrorCode.MEMO_NOT_FOUND));
        memoRepository.delete(memo);
    }

    // 메모 상세 조회
    @Transactional(readOnly = true)
    public MemoDetailResponseDto getDetailedMemo(Long memoId) {
        Memo memo = memoRepository.findByMemoId(memoId)
                .orElseThrow(()-> new CustomException(ErrorCode.MEMO_NOT_FOUND));

        return MemoDetailResponseDto.createMemoDetailResponse(memo);
    }

    // ex에서 받은 메모 정보 저장
    @Transactional
    public void createMemo(Long userId, SaveMemoRequestDto requestDto) {

        // userPrincipal.getUserId()
        User user = userRepository.findByUserIdAndIsDeleteFalse(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Memo memo = Memo.createMemo(requestDto, user);
        memoRepository.save(memo);
    }


}
