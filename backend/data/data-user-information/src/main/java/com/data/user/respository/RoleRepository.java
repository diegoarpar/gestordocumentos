package com.data.user.respository;

import com.data.user.model.RoleInformation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends CrudRepository<RoleInformation, Long> {
    RoleInformation findByName(String name);
}
