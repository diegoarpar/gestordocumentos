package com.itec.api.authorization.controller;

import com.itec.api.authorization.model.TokenServiceRequest;
import com.itec.api.authorization.services.CreateUserTokenService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.stream.Stream;

import static com.itec.util.authorization.helper.Constants.APP_AUTHORIZATION_HEADER;
import static com.itec.util.authorization.helper.Constants.USER_AUTHORIZATION_HEADER;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.SET_COOKIE;

/**
 * Create credential API
 *
 * @author diegoarpar
 */
@Controller
@RequestMapping("/authorization/user/token")
public class CreateUserTokenController extends BaseController<CreateUserTokenService> {


    public CreateUserTokenController(CreateUserTokenService service) {
        super(service);
    }

    /**
     * Create a user token
     *
     * @param req the http request
     * @param userAuthenticationServiceRequest the body request
     */
    @PostMapping
    public ResponseEntity<Object> execute(HttpServletRequest req,
                                          @RequestBody TokenServiceRequest userAuthenticationServiceRequest) {
        String tenant = BasicObjectUtil.getTenant(req);
        var authorization = req.getHeader(AUTHORIZATION);
        var consumerId = req.getHeader("consumer-id");
        userAuthenticationServiceRequest.setConsumerId(consumerId);
        var authorizationClaims = authorization.split(";");
        Stream.of(authorizationClaims).forEach(claim -> {
            if (claim.contains(USER_AUTHORIZATION_HEADER)) {
                userAuthenticationServiceRequest.setUserAuthorization(claim.replace(USER_AUTHORIZATION_HEADER + "=", ""));
            }
            if (claim.contains(APP_AUTHORIZATION_HEADER)) {
                userAuthenticationServiceRequest.setApplicationAuthorization(claim.replace(APP_AUTHORIZATION_HEADER + "=", ""));
            }
        });
        var result = service.execute(userAuthenticationServiceRequest);
        return ResponseEntity.ok()
                .header(SET_COOKIE, "user_authorization=" + result.getUserAuthorization())
                .body(result);
    }

}

