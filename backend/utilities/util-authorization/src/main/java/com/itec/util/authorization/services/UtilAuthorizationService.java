package com.itec.util.authorization.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.Map;

@Service
public class UtilAuthorizationService {

    private final RestClient rawClient;

    private final String TOKEN_URL;

    public UtilAuthorizationService(RestClient rawClient, @Value("${app.authorization.url}") String TOKEN_URL) {
        this.rawClient = rawClient;
        this.TOKEN_URL = TOKEN_URL;
    }

    public Map<String, Object> getUserToken(Map<String, String> headers) {
        return rawClient.post()
                .uri(TOKEN_URL)
                .headers(restHeaders -> headers.forEach((key, value)-> restHeaders.set(key, value)))
                .body(Map.of())
                .retrieve()
                .body(Map.class);
    }
}
