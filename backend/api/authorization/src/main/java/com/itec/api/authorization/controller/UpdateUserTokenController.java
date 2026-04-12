package com.itec.api.authorization.controller;

import com.itec.api.authorization.model.TokenServiceRequest;
import com.itec.api.authorization.services.UpdateUserTokenService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Create credential API
 *
 * @author diegoarpar
 */
@Controller
@RequestMapping("/authorization/user/token")
public class UpdateUserTokenController extends BaseController<UpdateUserTokenService> {

    public UpdateUserTokenController(UpdateUserTokenService service) {
        super(service);
    }

    /**
     * Create a user
     *
     * @param req the http request
     * @param userAuthenticationServiceRequest the body request
     */
    @PutMapping
    public ResponseEntity<Object> execute(HttpServletRequest req,
                                          @RequestBody TokenServiceRequest userAuthenticationServiceRequest) {
        String tenant = BasicObjectUtil.getTenant(req);
        var results = service.execute(userAuthenticationServiceRequest);
        return ResponseEntity.ok(results);
    }

}

