package com.itec.util.authorization.interceptor;

import com.itec.util.authorization.services.UtilAuthorizationService;
import com.itec.util.crypto.services.CryptoUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Builder;
import org.springframework.http.ResponseCookie;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import static com.itec.util.authorization.helper.Constants.USER_AUTHORIZATION_HEADER;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.SET_COOKIE;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

public class UtilUserAuthorizationJwtInterceptor implements HandlerInterceptor {

    private final UtilAuthorizationService utilAuthorizationService;
    private final CryptoUtil cryptoUtil;
    private final String consumerId;

    @Builder
    public UtilUserAuthorizationJwtInterceptor(UtilAuthorizationService utilAuthorizationService,
                                               CryptoUtil cryptoUtil,
                                               String consumerId) {
        this.consumerId = consumerId;
        this.utilAuthorizationService = utilAuthorizationService;
        this.cryptoUtil = cryptoUtil;
    }

    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        var userAuthorizationFromCookie = Stream.ofNullable(request.getCookies())
                .flatMap(Arrays::stream)
                .filter(cookie -> cookie.getName().contains(USER_AUTHORIZATION_HEADER))
                .findFirst()
                .map(cookie -> cookie.getValue())
                .orElse(null);

        String authHeader = Optional.ofNullable(request.getHeader(AUTHORIZATION))
                .flatMap(authorization -> Stream.of(authorization)
                        .filter(auth -> auth.contains(AUTHORIZATION + "="))
                        .findFirst()
                        .map(auth -> auth.replace(AUTHORIZATION + "=", "")))
                .orElseGet(() -> {
                    return userAuthorizationFromCookie;
                });

        if (authHeader == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(APPLICATION_JSON_VALUE);
            response.getWriter().write("""
                    {"error": "Missing or malformed Authorization header"}
                    """);
            return false;
        }

        try {
            var encryptedHeader = cryptoUtil.encrypt(authHeader);
            var headers = Map.of(AUTHORIZATION, USER_AUTHORIZATION_HEADER + "=" + encryptedHeader, "consumer-id", consumerId);
            var result = utilAuthorizationService.getUserTokenInformation(headers);

            request.setAttribute("userId", result.get("userId"));
            var cookie = ResponseCookie
                    .from("user_authorization", (String) result.get("userAuthorization"))
                    .path("/")
                    .httpOnly(true)
                    .secure(true) // Required for SameSite=None
                    .sameSite("Lax")
                    .maxAge(3600)
                    .build();
            response.setHeader(SET_COOKIE, cookie.toString());

            return true;

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("""
                    {"error": "%s"}
                    """.formatted(e.getMessage()));
            return false;
        }
    }
}
