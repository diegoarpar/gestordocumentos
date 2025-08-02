package com.data.user.repository;

import com.data.user.model.RoleModel;
import com.data.user.respository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootTest
@EnableTransactionManagement
public class RoleRepositoryTest {

    @Autowired
    RoleRepository repository;

    @Test
    public void testProcessRepository() {
        var role = RoleModel.builder().id(1L).name("admin").build();
        repository.save(role);
    }

    @Test
    public void testProcessRepositoryFind() {
        Iterable<RoleModel> info = repository.findAll();
        System.out.println(info);
    }
}
