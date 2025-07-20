package com.itec.workflowadministration.service.activity;

import com.data.workflow.mongo.model.ProcessModel;
import com.data.workflow.mongo.service.ProcessServiceRepository;
import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.request.ActivityRequestModel;
import com.itec.workflowadministration.model.response.ActivityResponseModel;
import org.springframework.stereotype.Service;

@Service
public class CreateActivityService implements BaseService<ActivityRequestModel, ActivityResponseModel> {


    @Override
    public ActivityResponseModel execute(ActivityRequestModel information) {
        return null;
    }
}
