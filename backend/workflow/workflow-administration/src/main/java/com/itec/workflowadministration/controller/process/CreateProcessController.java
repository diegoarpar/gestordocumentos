package com.itec.workflowadministration.controller.process;

import com.itec.utilities.service.BaseController;
import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.request.ProcessRequestModel;
import com.itec.workflowadministration.model.response.ProcessResponseModel;
import com.itec.workflowadministration.service.process.CreateProcessService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CreateProcessController implements BaseController<CreateProcessService, ProcessRequestModel, ProcessResponseModel> {

    BaseService service;

    public CreateProcessController(CreateProcessService service) {
        this.service = service;
    }

    @PostMapping(value = "/workflow/administration/process/")
    public void create(@RequestBody ProcessRequestModel request) {
        execute(request);
    }

    @Override
    public ProcessResponseModel execute(ProcessRequestModel information) {
        service.execute(information);
        return null;
    }
}
