package com.itec.workflowadministration.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpdateProcessController {

    @PutMapping(value = "/workflow/administration/process/{formId}")
    public void delete(Object request, @PathVariable String formId) {

    }
}
