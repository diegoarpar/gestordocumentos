package com.itec.api.authorization.controller;

import com.itec.api.authorization.model.ConsumerServiceRequest;
import com.itec.api.authorization.services.ReadConsumerService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Read consumers API.
 *
 * @author diegoarpar
 */
@Controller
@RequestMapping("/authorization/consumer")
public class ReadConsumerController extends BaseController<ReadConsumerService> {

    public ReadConsumerController(ReadConsumerService service) {
        super(service);
    }

    /**
     * Read all consumers.
     *
     * @param req the http request
     */
    @GetMapping
    public ResponseEntity<Object> execute(HttpServletRequest req) {
        var request = new ConsumerServiceRequest();
        request.setTenant(BasicObjectUtil.getTenant(req));
        var result = service.execute(request);
        return ResponseEntity.ok(result);
    }

}
