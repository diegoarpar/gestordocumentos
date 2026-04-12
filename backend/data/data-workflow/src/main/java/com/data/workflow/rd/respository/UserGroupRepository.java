package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.UserGroupInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface UserGroupRepository extends CrudRepository<UserGroupInformation, UUID> {

    List<UserGroupInformation> findByUserName(String userName);
}
