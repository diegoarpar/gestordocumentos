package com.itec.workflowadministration.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeleteProcessController {

    @DeleteMapping(value = "/workflow/administration/process/{formId}")
    public void create(Object request, @PathVariable String formId) {

    }

}
