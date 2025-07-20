package com.itec.workflowadministration.service.form;

import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.request.FormRequestModel;
import com.itec.workflowadministration.model.response.FormResponseModel;
import org.springframework.stereotype.Service;

@Service
public class UpdateFormService implements BaseService<FormRequestModel, FormResponseModel> {


    @Override
    public FormResponseModel execute(FormRequestModel information) {
        return null;
    }
}