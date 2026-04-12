package com.itec.api.authorization.controller;

import com.itec.api.authorization.model.ConsumerServiceRequest;
import com.itec.api.authorization.services.UpdateConsumerService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Update consumer API.
 *
 * @author diegoarpar
 */
@Controller
@RequestMapping("/authorization/consumer")
public class UpdateConsumerController extends BaseController<UpdateConsumerService> {

    public UpdateConsumerController(UpdateConsumerService service) {
        super(service);
    }

    /**
     * Update a consumer.
     *
     * @param req     the http request
     * @param request the body request
     */
    @PutMapping
    public ResponseEntity<Object> execute(HttpServletRequest req,
                                          @RequestBody ConsumerServiceRequest request) {
        request.setTenant(BasicObjectUtil.getTenant(req));
        var result = service.execute(request);
        return ResponseEntity.ok(result);
    }
}
