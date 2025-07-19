package com.itec.workflowadministration.service.roles;

import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.ProcessRequestModel;
import com.itec.workflowadministration.model.ProcessResponseModel;
import com.itec.workflowadministration.model.RolesRequestModel;
import com.itec.workflowadministration.model.RolesResponseModel;
import org.springframework.stereotype.Service;

@Service
public class CreateRolesService implements BaseService<RolesRequestModel, RolesResponseModel> {

    @Override
    public RolesResponseModel execute(RolesRequestModel information) {
        return null;
    }
}