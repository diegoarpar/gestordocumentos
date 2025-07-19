package com.itec.workflowadministration.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CreateProcessController {

    @PostMapping(value = "/workflow/administration/form/")
    public void create(Object request) {

    }

}
