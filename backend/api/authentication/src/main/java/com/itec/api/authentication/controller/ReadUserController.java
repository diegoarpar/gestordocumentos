package com.itec.api.authentication.controller;

import com.itec.api.authentication.model.User;
import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.services.ReadUserAuthenticationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/authentication/user")
public class ReadUserController {

    BaseService service;
    public ReadUserController(ReadUserAuthenticationService service) {
        this.service = service;
    }

    @GetMapping("/{userName}")
    public ResponseEntity<Object> execute(HttpServletRequest req, @PathVariable String userName) {
        String tenant = BasicObjectUtil.getTenant(req);
        var request = new UserAuthenticationServiceRequest();
        request.setUser(new User());
        request.getUser().setName(userName);
        var results = service.execute(request);
        return ResponseEntity.ok(results);
    }

}

