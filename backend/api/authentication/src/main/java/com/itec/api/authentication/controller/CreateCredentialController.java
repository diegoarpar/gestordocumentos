package com.itec.api.authentication.controller;

import com.itec.api.authentication.model.CredentialAuthenticationServiceRequest;
import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.services.CreateCredentialAuthenticationService;
import com.itec.api.authentication.services.CreateUserAuthenticationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Create credential API
 *
 * @author diegoarpar
 */
@Controller
@RequestMapping("/authentication/credential")
public class CreateCredentialController {

    /**
     * The user authentication.
     */
    BaseService service;
    public CreateCredentialController(CreateCredentialAuthenticationService service) {
        this.service = service;
    }

    /**
     * Create a user
     *
     * @param req the http request
     * @param userAuthenticationServiceRequest the body request
     */
    @PostMapping
    public ResponseEntity<Object> execute(HttpServletRequest req,
                                          @RequestBody CredentialAuthenticationServiceRequest userAuthenticationServiceRequest) {
        String tenant = BasicObjectUtil.getTenant(req);
        var results = service.execute(userAuthenticationServiceRequest);
        return ResponseEntity.ok(results);
    }

}

