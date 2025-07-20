package com.itec.workflowadministration.controller.activity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeleteActivityController {

    @DeleteMapping(value = "/workflow/administration/process/activity/{formId}")
    public void create(Object request, @PathVariable String formId) {

    }

}
