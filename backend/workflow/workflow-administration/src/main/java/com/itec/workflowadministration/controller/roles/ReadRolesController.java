package com.itec.workflowadministration.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReadRolesController {

    @GetMapping(value = "/workflow/administration/process/activity/{formId}")
    public void getForm(Object request, @PathVariable String formId) {

    }

}
