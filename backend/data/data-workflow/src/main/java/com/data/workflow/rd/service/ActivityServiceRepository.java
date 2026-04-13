package com.data.workflow.rd.service;

import com.data.workflow.rd.model.ActivityInformation;
import com.data.workflow.rd.respository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityServiceRepository {

    private final ActivityRepository repository;

    public ActivityInformation save(ActivityInformation model) {
        return repository.save(model);
    }

    public ActivityInformation find(ActivityInformation model) {
        return repository.findByName(model.getName());
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    public List<ActivityInformation> find() {
        var results = new ArrayList<ActivityInformation>();
        repository.findAll().forEach((data) -> {
            var activity = new ActivityInformation();
            activity.setId(data.getId());
            activity.setName(data.getName());
            activity.setHref(data.getHref());
            activity.setType(data.getType());
            activity.setKeyName(data.getKeyName());
            activity.setDescription(data.getDescription());
            activity.setActive(data.isActive());
            results.add(activity);
        });
        return results;
    }

    public ActivityInformation findByKeyName(String name) {
        var data = repository.findByKeyName(name);
        var activity = new ActivityInformation();
        activity.setId(data.getId());
        activity.setName(data.getName());
        activity.setHref(data.getHref());
        activity.setType(data.getType());
        activity.setKeyName(data.getKeyName());
        activity.setDescription(data.getDescription());
        activity.setActive(data.isActive());
        return data;
    }
}
