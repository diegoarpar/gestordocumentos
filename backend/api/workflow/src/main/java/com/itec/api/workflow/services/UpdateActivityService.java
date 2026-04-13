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
public class UpdateActivityService implements BaseService<ActivityServiceRequest, ActivityServiceResponse> {

    private final ActivityServiceRepository activityServiceRepository;

    @Override
    public ActivityServiceResponse execute(ActivityServiceRequest information) {
        var activity = new ActivityInformation();
        activity.setId(UUID.fromString(information.getId()));
        activity.setName(information.getName());
        activity.setKeyName(information.getKeyName());
        activity.setType(information.getType());
        activity.setHref(information.getHref());
        activity.setDescription(information.getDescription());
        activity.setActive(information.isActive());
        activityServiceRepository.save(activity);
        return new ActivityServiceResponse();
    }
}
