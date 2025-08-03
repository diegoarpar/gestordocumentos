package com.data.tenant.repository;

import com.data.tenant.model.TenantModel;
import com.data.tenant.respository.TenantRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootTest
@EnableTransactionManagement
public class TenantRepositoryTest {

    @Autowired
    TenantRepository repository;

    @Test
    public void testProcessRepository() {
        var tenant = TenantModel.builder().id(1L).origin("localhost:8080").build();
        repository.save(tenant);
        Iterable<TenantModel> info = repository.findAll();
        System.out.println(info);
    }

    @Test
    public void testProcessRepositoryFind() {
        Iterable<TenantModel> info = repository.findAll();
        System.out.println(info);
    }
}
