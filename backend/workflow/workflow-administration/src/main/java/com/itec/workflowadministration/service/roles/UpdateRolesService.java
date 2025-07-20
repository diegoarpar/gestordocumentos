package com.itec.workflowadministration.service.roles;

import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.request.RolesRequestModel;
import com.itec.workflowadministration.model.response.RolesResponseModel;
import org.springframework.stereotype.Service;

@Service
public class UpdateRolesService implements BaseService<RolesRequestModel, RolesResponseModel> {

    @Override
    public RolesResponseModel execute(RolesRequestModel information) {
        return null;
    }
}