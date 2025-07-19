package com.itec.workflowadministration.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReadProcessController {

    @GetMapping(value = "/workflow/administration/process/{formId}")
    public void getForm(Object request, @PathVariable String formId) {

    }

}
