package com.data.authorization.repository;

import com.data.authorization.model.DataAuthorizationModel;
import com.data.authorization.respository.DataAuthorizationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootTest
@EnableTransactionManagement
public class TenantRepositoryTest {

    @Autowired
    DataAuthorizationRepository repository;

    @Test
    public void testProcessRepository() {
        var data = new DataAuthorizationModel();
        repository.save(data);
        Iterable<DataAuthorizationModel> info = repository.findAll();
        System.out.println(info);
    }

    @Test
    public void testProcessRepositoryFind() {
        Iterable<DataAuthorizationModel> info = repository.findAll();
        System.out.println(info);
    }
}
