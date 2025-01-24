package com.dinnertime.peaktime.domain.group.entity;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Long groupId;

    @Column(name = "title", length = 32, nullable = false)
    private String title;

    @Column(name = "is_delete", nullable = false)
    private Boolean isDelete = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preset_id", nullable = false)
    private Preset preset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "root_user_id", nullable = false)
    private User user;

    @Builder
    private Group(String title, Preset preset, User user) {
        this.title = title;
        this.isDelete = false;
        this.preset = preset;
        this.user = user;
    }

    public static Group createGroup(String title, Preset preset, User user) {
        return Group.builder()
                .title(title)
                .preset(preset)
                .user(user)
                .build();
    }

    public void updateGroup(String newTitle, Preset newPreset) {
        this.title = newTitle;
        this.preset = newPreset;
    }

    public void deleteGroup() {
        this.isDelete = true;
    }
}
