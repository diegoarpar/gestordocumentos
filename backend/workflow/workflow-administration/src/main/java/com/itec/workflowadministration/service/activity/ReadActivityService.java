package com.itec.workflowadministration.service.activity;

import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.ActivityRequestModel;
import com.itec.workflowadministration.model.ActivityResponseModel;
import org.springframework.stereotype.Service;

@Service
public class DeleteActivityService implements BaseService<ActivityRequestModel, ActivityResponseModel> {


    @Override
    public ActivityResponseModel execute(ActivityRequestModel information) {
        return null;
    }
}