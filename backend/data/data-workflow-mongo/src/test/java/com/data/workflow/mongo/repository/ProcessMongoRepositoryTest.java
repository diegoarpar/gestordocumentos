package com.data.workflow.mongo.repository;

import com.data.workflow.mongo.model.ProcessInformationModel;
import com.data.workflow.mongo.respository.ProcessRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
@EnableTransactionManagement
public class ProcessMongoRepositoryTest {

    @Autowired
    ProcessRepository processRepository;

    @Test
    public void testProcessRepositoryWithTTL() {
        ProcessInformationModel model = new ProcessInformationModel(1L, "testNull", null);
        ProcessInformationModel model2 = new ProcessInformationModel(2L, "test20", (LocalDateTime.now().plusSeconds(1)));
        ProcessInformationModel model3 = new ProcessInformationModel(3L, "test30", (LocalDateTime.now().plusSeconds(2)));
        processRepository.save(model);
        processRepository.save(model2);
        processRepository.save(model3);
        Iterable<ProcessInformationModel> info = processRepository.findAll();
        System.out.println(info);
    }

    @Test
    public void testProcessRepositoryWithTTL2() {
        Iterable<ProcessInformationModel> info = processRepository.findAll();
        System.out.println(info);
    }
}
