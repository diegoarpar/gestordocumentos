package com.itec.workflowadministration.controller.roles;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpdateRolesController {

    @PutMapping(value = "/workflow/administration/roles/form/{formId}")
    public void delete(Object request, @PathVariable String formId) {

    }
}
