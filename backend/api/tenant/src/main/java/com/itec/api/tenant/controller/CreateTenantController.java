package com.itec.api.tenant.controller;

import com.itec.api.tenant.model.TenantServiceRequest;
import com.itec.api.tenant.services.CreateTenantService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/tenant")
public class CreateTenantController {

    BaseService service;
    public CreateTenantController(CreateTenantService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> crate(HttpServletRequest req) {
        var request = new TenantServiceRequest();
        service.execute(request);
        return ResponseEntity.ok().build();
    }

}

