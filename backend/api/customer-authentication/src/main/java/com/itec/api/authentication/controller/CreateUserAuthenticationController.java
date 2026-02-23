package com.itec.api.authentication.controller;

import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.services.UserAuthenticationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/authentication/login")
public class CreateUserAuthenticationController {

    BaseService service;
    public CreateUserAuthenticationController(UserAuthenticationService service) {
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
                                          @RequestBody UserAuthenticationServiceRequest userAuthenticationServiceRequest) {
        String tenant = BasicObjectUtil.getTenant(req);
        var request = new UserAuthenticationServiceRequest();
        var results = service.execute(request);
        return ResponseEntity.ok(results);
    }

}

