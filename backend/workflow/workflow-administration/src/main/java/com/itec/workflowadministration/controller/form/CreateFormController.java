package com.itec.workflowadministration.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CreateFormController {

    @PostMapping(value = "/workflow/administration/process/form/")
    public void create(Object request) {

    }

}
