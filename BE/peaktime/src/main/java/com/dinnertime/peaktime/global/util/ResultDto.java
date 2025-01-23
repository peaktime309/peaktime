package com.dinnertime.peaktime.global.util;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ResultDto<T> {

    private int status;

    private String message;

    private T data;

    public ResultDto(final int status, final String message) {
        this.status = status;
        this.message = message;
        data = null;
    }

    // data 비포함, 상태코드와 메시지만
    public static <T> ResultDto <T> res(final int status, final String message) {
        return res(status, message, null);
    }

    // data 포함해서 전송
    public static <T> ResultDto <T> res(final int status, final String message, final T t) {
        return ResultDto.<T>builder()
                .data(t)
                .status(status)
                .message(message)
                .build();

    }

}
