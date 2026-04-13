package com.itec.api.authorization.controller;

import com.itec.api.authorization.model.ConsumerServiceRequest;
import com.itec.api.authorization.services.DeleteConsumerService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Delete consumer API.
 *
 * @author diegoarpar
 */
@Controller
@RequestMapping("/authorization/consumer")
public class DeleteConsumerController extends BaseController<DeleteConsumerService> {

    public DeleteConsumerController(DeleteConsumerService service) {
        super(service);
    }

    /**
     * Delete a consumer.
     *
     * @param req     the http request
     * @param request the body request
     */
    @DeleteMapping
    public ResponseEntity<Object> execute(HttpServletRequest req,
                                          @RequestBody ConsumerServiceRequest request) {
        request.setTenant(BasicObjectUtil.getTenant(req));
        var result = service.execute(request);
        return ResponseEntity.ok(result);
    }
}
