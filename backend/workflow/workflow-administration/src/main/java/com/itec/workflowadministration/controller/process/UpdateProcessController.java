package com.itec.workflowadministration.controller.process;

import com.itec.utilities.service.BaseController;
import com.itec.workflowadministration.model.request.ProcessRequestModel;
import com.itec.workflowadministration.model.response.ProcessResponseModel;
import com.itec.workflowadministration.service.process.UpdateProcessService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpdateProcessController implements BaseController<UpdateProcessService, ProcessRequestModel, ProcessResponseModel> {

    @PutMapping(value = "/workflow/administration/process/{formId}")
    public void delete(Object request, @PathVariable String formId) {

    }

    @Override
    public ProcessResponseModel execute(ProcessRequestModel information) {
        return null;
    }
}
