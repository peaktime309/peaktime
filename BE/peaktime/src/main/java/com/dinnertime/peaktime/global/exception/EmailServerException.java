package com.dinnertime.peaktime.global.exception;

public class EmailServerException extends RuntimeException {

    public EmailServerException() {
        // Set Default Message
        super("이메일 전송을 실패하였습니다.");
    }

}
