package com.itec.api.authentication.controller;

import com.itec.api.authentication.model.User;
import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.services.UserAuthenticationService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
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
        request.getUser().setCredentials(userAuthenticationServiceRequest.getUser().getCredentials());
        var result = service.execute(request);
        if (!StringUtils.hasText(result.getJwt())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication is required to access this resource.");
        }
        return ResponseEntity.ok()
                .header(SET_COOKIE, "user_authorization=" + result.getJwt())
                .body(result);
    }
}

