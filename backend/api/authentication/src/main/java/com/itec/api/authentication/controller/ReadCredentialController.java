package com.itec.api.authentication.controller;

import com.itec.api.authentication.model.Credential;
import com.itec.api.authentication.model.CredentialAuthenticationServiceRequest;
import com.itec.api.authentication.services.ReadCredentialAuthenticationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/authentication/credential")
public class ReadCredentialController {

    BaseService service;
    public ReadCredentialController(ReadCredentialAuthenticationService service) {
        this.service = service;
    }

    @GetMapping("/{credentialName}")
    public ResponseEntity<Object> execute(HttpServletRequest req, @PathVariable String credentialName) {
        String tenant = BasicObjectUtil.getTenant(req);
        var request = new CredentialAuthenticationServiceRequest();
        request.setCredential(new Credential());
        request.getCredential().setName(credentialName);
        var results = service.execute(request);
        return ResponseEntity.ok(results);
    }

}

