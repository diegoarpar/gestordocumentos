package com.itec.api.authentication.controller;

import com.itec.api.authentication.model.User;
import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.services.UserAuthenticationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.http.HttpHeaders.SET_COOKIE;

@Controller
@RequestMapping("/authentication/login")
public class ReadLoginUserController extends BaseController<UserAuthenticationService> {

    protected ReadLoginUserController(UserAuthenticationService service) {
        super(service);
    }

    @PostMapping
    public ResponseEntity<Object> execute(HttpServletRequest req, @RequestBody UserAuthenticationServiceRequest userAuthenticationServiceRequest) {
        String tenant = BasicObjectUtil.getTenant(req);
        var request = new UserAuthenticationServiceRequest();
        request.setUser(new User());
        request.getUser().setName(userAuthenticationServiceRequest.getUser().getName());
        var result = service.execute(request);

        return ResponseEntity.ok()
                .header(SET_COOKIE, "user_authorization=" + result.getJwt())
                .body(result);
    }
}

