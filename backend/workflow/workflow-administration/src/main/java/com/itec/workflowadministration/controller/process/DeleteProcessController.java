package com.itec.workflowadministration.controller.process;

import com.itec.utilities.service.BaseController;
import com.itec.workflowadministration.model.request.ProcessRequestModel;
import com.itec.workflowadministration.model.response.ProcessResponseModel;
import com.itec.workflowadministration.service.process.DeleteProcessService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeleteProcessController implements BaseController<DeleteProcessService, ProcessRequestModel, ProcessResponseModel> {

    @DeleteMapping(value = "/workflow/administration/process/{formId}")
    public void create(Object request, @PathVariable String formId) {

    }

    @Override
    public ProcessResponseModel execute(ProcessRequestModel information) {
        return null;
    }
}
