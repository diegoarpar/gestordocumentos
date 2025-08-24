package com.itec.api.authorization.controller;

import com.itec.api.authorization.model.UserAuthorizationServiceRequest;
import com.itec.api.authorization.services.UserAuthorizationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/authentication/login")
public class UserAuthorizationController {

    BaseService service;
    public UserAuthorizationController(UserAuthorizationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Object> execute(HttpServletRequest req) {
        String tenant = BasicObjectUtil.getTenant(req);
        var request = new UserAuthorizationServiceRequest();
        service.execute(request);
        return ResponseEntity.ok().build();
    }

}

