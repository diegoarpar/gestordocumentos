package com.data.user.repository;

import com.data.customer.user.model.PasswordModel;
import com.data.customer.user.respository.PasswordRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootTest
@EnableTransactionManagement
public class PasswordRepositoryTest {

    @Autowired
    PasswordRepository repository;

    @Test
    public void testProcessRepository() {
        var passwordModel = PasswordModel.builder().id(1L).password("1234").salt("1234").build();
        repository.save(passwordModel);
        Iterable<PasswordModel> info = repository.findAll();
        System.out.println(info);
    }

    @Test
    public void testProcessRepositoryFind() {
        Iterable<PasswordModel> info = repository.findAll();
        System.out.println(info);
    }
}
