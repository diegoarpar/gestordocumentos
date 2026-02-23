package com.itec.api.authentication.controller;

import com.itec.api.authentication.model.Role;
import com.itec.api.authentication.model.RoleAuthenticationServiceRequest;
import com.itec.api.authentication.services.ReadRoleAuthenticationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/authentication/role")
public class ReadRoleController {

    BaseService service;
    public ReadRoleController(ReadRoleAuthenticationService service) {
        this.service = service;
    }

    @GetMapping("/{roleName}")
    public ResponseEntity<Object> execute(HttpServletRequest req, @PathVariable String roleName) {
        String tenant = BasicObjectUtil.getTenant(req);
        var request = new RoleAuthenticationServiceRequest();
        request.setRole(new Role());
        request.getRole().setName(roleName);
        var results = service.execute(request);
        return ResponseEntity.ok(results);
    }

}

