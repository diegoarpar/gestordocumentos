package com.data.workflow.cassandra.repostory;

import com.data.workflow.cassandra.model.ProcessInformation;
import com.data.workflow.cassandra.respository.ProcessRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootTest
@EnableTransactionManagement
public class ProcessRepositoryTest {

    @Autowired
    ProcessRepository processRepository;

    @Test
    public void testProcessRepositoryWithTTL() {
        ProcessInformation model = new ProcessInformation(1L, "test");
        ProcessInformation model2 = new ProcessInformation(2L, "test");
        ProcessInformation model3 = new ProcessInformation(3L, "test");
        processRepository.saveWithTtl(model, 20);
        processRepository.saveWithTtl(model2, 30);
        processRepository.save(model3);
    }
}
