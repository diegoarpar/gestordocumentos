package com.itec.workflowadministration.service.process;

import com.data.workflow.mongo.model.ProcessModel;
import com.data.workflow.mongo.service.ProcessServiceRepository;
import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.request.ProcessRequestModel;
import com.itec.workflowadministration.model.response.ProcessResponseModel;
import org.springframework.stereotype.Service;

@Service
public class CreateProcessService implements BaseService<ProcessRequestModel, ProcessResponseModel> {

    ProcessServiceRepository repository;

    public CreateProcessService(ProcessServiceRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProcessResponseModel execute(ProcessRequestModel information) {
        repository.save(new ProcessModel(null, information.getName(), null, null, null));
        return null;
    }
}