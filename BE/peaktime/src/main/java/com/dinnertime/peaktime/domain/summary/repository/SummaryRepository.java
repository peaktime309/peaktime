package com.dinnertime.peaktime.domain.summary.repository;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import com.dinnertime.peaktime.domain.summary.entity.Summary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {

    // 요약 단독 삭제 시 사용하기 위함
    Optional<Summary> findBySummaryId(Long summaryId);

    // 메모리스트 조회시 사용
    Page<Summary> findAllByUser_UserId(Long userId, Pageable pageable);
}
