package com.dinnertime.peaktime.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private Long userId; // PK

    @Column(name="user_login_id", nullable = false, unique = true, length = 15)
    private String userLoginId; // 유저 로그인 아이디

    @Setter
    @Column(name = "password", nullable = false, length = 64)
    private String password; // 비밀번호

    @Setter
    @Column(name = "nickname", nullable = false, length = 20)
    private String nickname; // 닉네임

    @Setter
    @Column(name = "email", unique = true, length = 64)
    private String email; // 이메일

    @Column(name = "is_root", nullable = false)
    private Boolean isRoot; // 루트 유저 여부

    @Column(name = "is_delete", nullable = false)
    private Boolean isDelete; // 삭제 여부

    @Builder
    private User(String userLoginId, String password, String nickname, String email, Boolean isRoot, Boolean isDelete) {
        this.userLoginId = userLoginId;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.isRoot = isRoot;
        this.isDelete = isDelete;
    }

    public static User createRootUser(String userLoginId, String password, String nickname, String email) {
        return User.builder()
                .userLoginId(userLoginId)
                .password(password)
                .nickname(nickname)
                .email(email)
                .isRoot(true)
                .isDelete(false) // Default value
                .build();
    }

    public static User createChildUser(String userLoginId, String password, String nickname) {
        return User.builder()
                .userLoginId(userLoginId)
                .password(password)
                .nickname(nickname)
                .email(null)
                .isRoot(false)
                .isDelete(false) // Default value
                .build();
    }

    public void updateNickname(String nickname){
        this.nickname = nickname;
    }

    public void updatePassword(String password){
        this.password = password;
    }

    public void deleteUser() {
        this.email = null;
        this.isDelete = true;
    }

}
