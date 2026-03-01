package com.itec.api.workflow.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

import java.util.List;

@Data
public class UserGroupServiceResponse implements BaseServiceResponse {
    List<UserGroup> userGroups;
}