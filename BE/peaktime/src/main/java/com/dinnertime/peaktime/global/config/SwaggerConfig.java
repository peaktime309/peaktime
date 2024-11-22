package com.dinnertime.peaktime.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                // bearer token 설정하기
                .components(new Components().addSecuritySchemes("bearer-key",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-key"))
                // 문서 설명
                .info(new Info().title("PeakTime API")
                        .description("PeakTime API 문서")
                        .version("1.0"))
                // 첫 번째 url -> http 서버 연결하는 방식
                // 두 번째 url -> https 서버 연결하는 방식
                // 세 번째 url -> local 서버 연결하는 방식

                // 서버 URL을 HTTPS로 설정 및 기본 경로 추가
                .servers(Arrays.asList(
//                        new Server().url("http://k11b309.p.ssafy.io:8080/api/v1"),
                        new Server().url("https://k11b309.p.ssafy.io/api/v1"),
                        new Server().url("http://localhost:8080/api/v1")));
    }
}
