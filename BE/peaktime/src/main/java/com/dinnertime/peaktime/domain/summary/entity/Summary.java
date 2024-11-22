package com.dinnertime.peaktime.domain.summary.entity;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import com.dinnertime.peaktime.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name="summaries")
public class Summary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="summary_id")
    private Long summaryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "title", length = 20, nullable = false)
    private String title;

    @Builder
    private Summary(LocalDateTime createdAt, String content, String title, User user) {
        this.createdAt = createdAt;
        this.content = content; // gpt 내용이 담겨야 함
        this.title = title;
        this.user = user;
    }

    // 요약 내용 저장
    public static Summary createSummary(String GPTContent, String title, User user) {
        return Summary.builder()
                .createdAt(LocalDateTime.now())
                .content(GPTContent) // gpt 내용이 담겨야 함
                .title(title)
                .user(user)
                .build();
    }
}
