package com.data.workflow.mongo.repository;

import com.data.workflow.mongo.model.ProcessModel;
import com.data.workflow.mongo.respository.ProcessRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.time.LocalDateTime;

@SpringBootTest
@EnableTransactionManagement
public class ProcessMongoRepositoryTest {

    @Autowired
    ProcessRepository processRepository;

    @Test
    public void testProcessRepositoryWithTTL() {
        ProcessModel model = new ProcessModel(1L, "testNull", null, null,null);
        ProcessModel model2 = new ProcessModel(2L, "test20", (LocalDateTime.now().plusSeconds(1)), null,null);
        ProcessModel model3 = new ProcessModel(3L, "test30", (LocalDateTime.now().plusSeconds(2)), null,null);
        processRepository.save(model);
        processRepository.save(model2);
        processRepository.save(model3);
        Iterable<ProcessModel> info = processRepository.findAll();
        System.out.println(info);
    }

    @Test
    public void testProcessRepositoryWithTTL2() {
        Iterable<ProcessModel> info = processRepository.findAll();
        System.out.println(info);
    }
}
