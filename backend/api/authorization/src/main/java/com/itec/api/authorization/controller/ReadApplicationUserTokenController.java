package com.itec.api.authorization.controller;

import com.itec.api.authorization.model.TokenServiceRequest;
import com.itec.api.authorization.services.ReadApplicationTokenService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Create credential API
 *
 * @author diegoarpar
 */
@Controller
@RequestMapping("/authorization/application/token")
public class ReadApplicationUserTokenController extends BaseController<ReadApplicationTokenService> {


    public ReadApplicationUserTokenController(ReadApplicationTokenService service) {
        super(service);
    }

    /**
     * Read an application token
     *
     * @param req the http request
     * @param userAuthenticationServiceRequest the body request
     */
    @GetMapping
    public ResponseEntity<Object> execute(HttpServletRequest req,
                                          @RequestBody TokenServiceRequest userAuthenticationServiceRequest) {
        String tenant = BasicObjectUtil.getTenant(req);
        var results = service.execute(userAuthenticationServiceRequest);
        return ResponseEntity.ok(results);
    }

}

