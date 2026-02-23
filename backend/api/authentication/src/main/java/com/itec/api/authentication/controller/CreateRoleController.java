package com.itec.api.authentication.controller;

import com.itec.api.authentication.model.RoleAuthenticationServiceRequest;
import com.itec.api.authentication.services.CreateRoleAuthenticationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Create user API
 *
 * @author diegoarpar
 */
@Controller
@RequestMapping("/authentication/role")
public class CreateRoleController {

    /**
     * The user authentication.
     */
    BaseService service;
    public CreateRoleController(CreateRoleAuthenticationService service) {
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
                                          @RequestBody RoleAuthenticationServiceRequest userAuthenticationServiceRequest) {
        String tenant = BasicObjectUtil.getTenant(req);
        var results = service.execute(userAuthenticationServiceRequest);
        return ResponseEntity.ok(results);
    }

}

