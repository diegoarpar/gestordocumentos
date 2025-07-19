package com.itec.workflowadministration.service.process;

import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.ProcessRequestModel;
import com.itec.workflowadministration.model.ProcessResponseModel;
import org.springframework.stereotype.Service;

@Service
public class UpdateProcessService implements BaseService<ProcessRequestModel, ProcessResponseModel> {

    @Override
    public ProcessResponseModel execute(ProcessRequestModel information) {
        return null;
    }
}