package com.data.user.respository;

import com.data.user.model.PasswordModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordRepository extends CrudRepository<PasswordModel, Long> {
}
