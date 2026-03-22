package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.ActivityServiceRepository;
import com.itec.api.workflow.model.Activity;
import com.itec.api.workflow.model.ActivityServiceRequest;
import com.itec.api.workflow.model.ActivityServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReadActivityService implements BaseService<ActivityServiceRequest, ActivityServiceResponse> {

    private final ActivityServiceRepository activityServiceRepository;

    @Override
    public ActivityServiceResponse execute(ActivityServiceRequest information) {
        var results = activityServiceRepository.find();
        var activities = results.stream().map(a -> {
            var activity = new Activity();
            activity.setId(a.getId());
            activity.setName(a.getName());
            activity.setHref(a.getHref());
            activity.setType(a.getType());
            activity.setDescription(a.getDescription());
            activity.setActive(a.isActive());
            return activity;
        }).toList();
        var response = new ActivityServiceResponse();
        response.setActivities(activities);
        return response;
    }
}
