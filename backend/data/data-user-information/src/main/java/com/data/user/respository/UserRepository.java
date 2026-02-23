package com.data.user.respository;

import com.data.user.model.UserInformation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<UserInformation, Long> {
    UserInformation findByName(String name);
}
