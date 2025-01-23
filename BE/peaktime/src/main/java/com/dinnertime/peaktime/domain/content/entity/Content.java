package com.dinnertime.peaktime.domain.content.entity;

import com.dinnertime.peaktime.domain.hiking.entity.Hiking;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.ContentListRequestDto;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "contents")
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Long contentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hiking_id", nullable = false)
    private Hiking hiking;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "type", nullable = false, length = 10)
    private String type;

    @Column(name = "using_time", nullable = false)
    private Integer usingTime;

    @Column(name = "is_blocked", nullable = false)
    private Boolean isBlocked;

    @Builder
    private Content(Hiking hiking, String name, String type, Integer usingTime, Boolean isBlocked) {
        this.hiking = hiking;
        this.name = name;
        this.type = type;
        this.usingTime = usingTime;
        this.isBlocked = isBlocked;
    }


    public static Content createContent(Hiking hiking, ContentListRequestDto requestDto) {
        return Content.builder()
                .hiking(hiking)
                .name(requestDto.getContentName())
                .type(requestDto.getContentType())
                .usingTime(requestDto.getUsingTime())
                .isBlocked(requestDto.getIsBlockContent())
                .build();
    }
}
