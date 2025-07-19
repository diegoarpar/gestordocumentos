package com.itec.workflowadministration.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpdateActivityController {

    @PutMapping(value = "/workflow/administration/process/activity/{formId}")
    public void delete(Object request, @PathVariable String formId) {

    }
}
