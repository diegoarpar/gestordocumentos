package com.data.user.repository;

import com.data.customer.user.model.PasswordModel;
import com.data.customer.user.model.RoleModel;
import com.data.customer.user.model.UserModel;
import com.data.customer.user.respository.UserRepository;
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
        var passwordModel = PasswordModel.builder().id(1L).build();
        var roleModel = RoleModel.builder().id(1L).build();
        UserModel model = UserModel.builder()
                .id(1L)
                .name("testNull")
                .roleModelList(List.of(roleModel))
                .passwordModels(List.of(passwordModel))
                .build();
        UserModel model2 = UserModel.builder()
                .id(2L)
                .name("test2")
                .passwordModels(List.of(passwordModel))
                .build();
        UserModel model3 = UserModel.builder()
                .id(3L)
                .name("test3")
                .roleModelList(List.of(roleModel))
                .build();
        userRepository.save(model);
        userRepository.save(model2);
        userRepository.save(model3);
        Iterable<UserModel> info = userRepository.findAll();
        System.out.println(info);
    }

    @Test
    public void testProcessRepositoryFind() {
        Iterable<UserModel> info = userRepository.findAll();
        System.out.println(info);
    }
}
