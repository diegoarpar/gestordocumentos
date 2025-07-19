package com.itec.workflowadministration.service.form;

import com.itec.utilities.service.BaseService;
import com.itec.workflowadministration.model.FormRequestModel;
import com.itec.workflowadministration.model.FormResponseModel;
import org.springframework.stereotype.Service;

@Service
public class CreateFormService implements BaseService<FormRequestModel, FormResponseModel> {


    @Override
    public FormResponseModel execute(FormRequestModel information) {
        return null;
    }
}