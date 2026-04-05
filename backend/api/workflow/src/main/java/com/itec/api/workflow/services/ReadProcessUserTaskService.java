package com.itec.api.workflow.services;

import com.data.workflow.activity.model.ProcessInformation;
import com.data.workflow.activity.service.ProcessTaskService;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.model.ProcessDefinitionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReadProcessUserTaskService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {
    private final ProcessTaskService processTaskService;
    private final ReadWorkflowUserGroupService readWorkflowUserGroupService;
    private final ReadWorkflowGroupsService readWorkflowGroupsService;

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        var userId = information.getProcessInformation().get(ProcessInformation.USER_NAME.name());
        var tenantId = information.getTenant();
        var userGroups = readWorkflowUserGroupService.findByUserId((String) userId);
        var roles = new ArrayList<String>();
        for (var userGroup : userGroups.getUserGroups()) {
            var role = readWorkflowGroupsService.getGroupById(userGroup.getGroupId());
            if (role != null && !role.getGroups().isEmpty()) {
                var roleName = role.getGroups().getFirst().getName();
                roles.add(roleName);
            }
        }
        var results = processTaskService.getTask(tenantId, (String) userId, roles);
        var response = new ProcessDefinitionServiceResponse();
        response.setTaskInformation(results);
        return response;
    }
}
