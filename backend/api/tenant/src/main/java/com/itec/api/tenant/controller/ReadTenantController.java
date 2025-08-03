package com.itec.api.tenant.controller;

import com.itec.api.tenant.model.TenantServiceRequest;
import com.itec.api.tenant.services.ReadTenantService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/tenant")
public class ReadTenantController {

    BaseService service;
    public ReadTenantController(ReadTenantService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Object> read(HttpServletRequest req) {
        var request = new TenantServiceRequest();
        request.setOrigin(req.getHeader("Referer"));
        var result = service.execute(request);
        return ResponseEntity.ok(result);
    }

}

