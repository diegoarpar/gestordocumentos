package com.itec.workflowadministration.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CreateRolesController {

    @PostMapping(value = "/workflow/administration/process/roles/")
    public void create(Object request) {

    }

}
