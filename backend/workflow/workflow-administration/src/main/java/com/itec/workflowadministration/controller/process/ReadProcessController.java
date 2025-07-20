package com.itec.workflowadministration.controller.process;


import com.itec.utilities.service.BaseController;
import com.itec.workflowadministration.model.request.ProcessRequestModel;
import com.itec.workflowadministration.model.response.ProcessResponseModel;
import com.itec.workflowadministration.service.process.ReadProcessService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReadProcessController implements BaseController<ReadProcessService, ProcessRequestModel, ProcessResponseModel> {

    @GetMapping(value = "/workflow/administration/process/{formId}")
    public void getForm(Object request, @PathVariable String formId) {

    }

    @Override
    public ProcessResponseModel execute(ProcessRequestModel information) {
        return null;
    }
}
