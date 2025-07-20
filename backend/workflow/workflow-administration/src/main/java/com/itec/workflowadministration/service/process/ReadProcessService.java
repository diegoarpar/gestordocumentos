package com.itec.workflowadministration.service.process;

import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.request.ProcessRequestModel;
import com.itec.workflowadministration.model.response.ProcessResponseModel;
import org.springframework.stereotype.Service;

@Service
public class ReadProcessService implements BaseService<ProcessRequestModel, ProcessResponseModel> {

    @Override
    public ProcessResponseModel execute(ProcessRequestModel information) {
        return null;
    }
}