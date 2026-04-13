package com.itec.api.authorization.controller;

import com.itec.api.authorization.model.TokenServiceRequest;
import com.itec.api.authorization.services.ReadUserTokenService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.stream.Stream;

import static com.itec.util.authorization.helper.Constants.APP_AUTHORIZATION_HEADER;
import static com.itec.util.authorization.helper.Constants.USER_AUTHORIZATION_HEADER;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

/**
 * Create credential API
 *
 * @author diegoarpar
 */
@Controller
@RequestMapping("/authorization/user/token")
public class ReadUserTokenController extends BaseController<ReadUserTokenService> {

    public ReadUserTokenController(ReadUserTokenService service) {
        super(service);
    }

    /**
     * Create a user
     *
     * @param req the http request
     */
    @GetMapping
    public ResponseEntity<Object> execute(HttpServletRequest req) {
        var userAuthenticationServiceRequest = new TokenServiceRequest();
        userAuthenticationServiceRequest.setConsumerId(req.getHeader("consumer-id"));
        var authorization = req.getHeader(AUTHORIZATION);
        var authorizationClaims = authorization.split(";");
        Stream.of(authorizationClaims).forEach(claim -> {
            if (claim.contains(USER_AUTHORIZATION_HEADER)) {
                userAuthenticationServiceRequest.setUserAuthorization(claim.replace(USER_AUTHORIZATION_HEADER + "=", ""));
            }
            if (claim.contains(APP_AUTHORIZATION_HEADER)) {
                userAuthenticationServiceRequest.setApplicationAuthorization(claim.replace(APP_AUTHORIZATION_HEADER + "=", ""));
            }
        });
        String tenant = BasicObjectUtil.getTenant(req);
        var results = service.execute(userAuthenticationServiceRequest);
        return ResponseEntity.ok(results);
    }

}

