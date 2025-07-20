package com.itec.workflowadministration.service.activity;

import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.request.ActivityRequestModel;
import com.itec.workflowadministration.model.response.ActivityResponseModel;
import org.springframework.stereotype.Service;

@Service
public class DeleteActivityService implements BaseService<ActivityRequestModel, ActivityResponseModel> {


    @Override
    public ActivityResponseModel execute(ActivityRequestModel information) {
        return null;
    }
}