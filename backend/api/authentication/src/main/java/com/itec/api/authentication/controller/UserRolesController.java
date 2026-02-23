package com.itec.api.authentication.controller;

import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.services.UserAuthenticationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/authentication/roles")
public class UserRolesController {

    BaseService service;
    public UserRolesController(UserAuthenticationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Object> execute(HttpServletRequest req) {
        String tenant = BasicObjectUtil.getTenant(req);
        var request = new UserAuthenticationServiceRequest();
        var results = service.execute(request);
        return ResponseEntity.ok(results);
    }

}

