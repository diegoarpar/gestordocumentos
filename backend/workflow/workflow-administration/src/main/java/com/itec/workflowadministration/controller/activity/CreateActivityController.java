package com.itec.workflowadministration.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CreateActivityController {

    @PostMapping(value = "/workflow/administration/process/activity/")
    public void create(Object request) {

    }

}
