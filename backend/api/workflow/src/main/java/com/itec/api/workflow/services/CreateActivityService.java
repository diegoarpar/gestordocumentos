package com.itec.api.workflow.services;

import com.data.workflow.rd.model.ActivityInformation;
import com.data.workflow.rd.service.ActivityServiceRepository;
import com.itec.api.workflow.model.ActivityServiceRequest;
import com.itec.api.workflow.model.ActivityServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateActivityService implements BaseService<ActivityServiceRequest, ActivityServiceResponse> {

    private final ActivityServiceRepository activityServiceRepository;

    @Override
    public ActivityServiceResponse execute(ActivityServiceRequest information) {
        var activity = new ActivityInformation();
        activity.setType(information.getType());
        activity.setHref(information.getHref());
        activity.setName(information.getName());
        activity.setKeyName(information.getKeyName());
        activity.setDescription(information.getDescription());
        activity.setActive(true);
        activityServiceRepository.save(activity);
        return new ActivityServiceResponse();
    }
}
