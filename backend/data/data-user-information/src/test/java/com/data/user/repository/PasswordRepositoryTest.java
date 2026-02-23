package com.data.user.repository;

import com.data.user.model.CredentialInformation;
import com.data.user.respository.CredentialRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootTest
@EnableTransactionManagement
public class PasswordRepositoryTest {

    @Autowired
    CredentialRepository repository;

    @Test
    public void testProcessRepository() {
        var passwordModel = CredentialInformation.builder().id(1L).password("1234").salt("1234").build();
        repository.save(passwordModel);
        Iterable<CredentialInformation> info = repository.findAll();
        System.out.println(info);
    }

    @Test
    public void testProcessRepositoryFind() {
        Iterable<CredentialInformation> info = repository.findAll();
        System.out.println(info);
    }
}
