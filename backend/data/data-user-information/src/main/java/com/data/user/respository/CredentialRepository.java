package com.data.user.respository;

import com.data.user.model.CredentialInformation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CredentialRepository extends CrudRepository<CredentialInformation, Long> {
    CredentialInformation findByValue(String value);
}
