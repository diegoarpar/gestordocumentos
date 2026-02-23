package com.data.user.repository;

import com.data.user.model.CredentialInformation;
import com.data.user.model.RoleInformation;
import com.data.user.model.UserInformation;
import com.data.user.respository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.List;

@SpringBootTest
@EnableTransactionManagement
public class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @Test
    public void testProcessRepository() {
        var passwordModel = CredentialInformation.builder().id(1L).build();
        var roleModel = RoleInformation.builder().id(1L).build();
        UserInformation model = UserInformation.builder()
                .id(1L)
                .name("testNull")
                .roleModelList(List.of(roleModel))
                .passwordModels(List.of(passwordModel))
                .build();
        UserInformation model2 = UserInformation.builder()
                .id(2L)
                .name("test2")
                .passwordModels(List.of(passwordModel))
                .build();
        UserInformation model3 = UserInformation.builder()
                .id(3L)
                .name("test3")
                .roleModelList(List.of(roleModel))
                .build();
        userRepository.save(model);
        userRepository.save(model2);
        userRepository.save(model3);
        Iterable<UserInformation> info = userRepository.findAll();
        System.out.println(info);
    }

    @Test
    public void testProcessRepositoryFind() {
        Iterable<UserInformation> info = userRepository.findAll();
        System.out.println(info);
    }
}
