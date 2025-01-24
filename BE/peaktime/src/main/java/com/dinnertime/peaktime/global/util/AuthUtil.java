package com.dinnertime.peaktime.global.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AuthUtil {

    // 아이디 형식 검사 (형식에 맞으면 true, 형식에 맞지 않으면 false)
    public static boolean checkFormatValidationUserLoginId(String userLoginId) {
        // 정규식: 영문과 숫자로 이루어진 5자 이상 15자 이하의 문자열
        String regex = "^[a-zA-Z0-9]{5,15}$";
        return userLoginId.matches(regex);
    }

    // 영문 대문자를 영문 소문자로 변환
    public static String convertUpperToLower(String input) {
        return input.toLowerCase();
    }

    // 비밀번호 형식 검사 (형식에 맞으면 true, 형식에 맞지 않으면 false)
    public static boolean checkFormatValidationPassword(String password) {
        // 정규식 : 영문 대문자, 영문 소문자, 숫자, 특수문자(모든 특수문자로 확장하여 허용)를 각각 포함하여 최소 8자 이상 -> 영문 대문자, 영문 소문자, 숫자, 특수문자를 제외한 문자는 false 처리.
        String pattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-\\[\\]{};':\"\\\\|,.<>\\/?])[A-Za-z\\d!@#$%^&*()_+\\-\\[\\]{};':\"\\\\|,.<>\\/?]{8,}$";
        // Pattern 및 Matcher를 사용해 정규식 검증
        Pattern compiledPattern = Pattern.compile(pattern);
        Matcher matcher = compiledPattern.matcher(password);
        // 정규식 패턴에 일치하면 true 반환, 아니면 false 반환
        return matcher.matches();
    }

    // 닉네임 형식 검사 (형식에 맞으면 true, 형식에 맞지 않으면 false)
    public static boolean checkFormatValidationNickname(String nickname) {
        // 정규식: 한글, 영문 대소문자, 숫자로 이루어진 2자 이상 8자 이하의 문자열
        String regex = "^[a-zA-Z0-9가-힣_\\[\\]]{2,15}$";
        return nickname.matches(regex);
    }

    // 이메일 형식 검사 (형식에 맞으면 true, 형식에 맞지 않으면 false)
    public static boolean checkFormatValidationEmail(String email) {
        String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email.matches(regex);
    }
}
