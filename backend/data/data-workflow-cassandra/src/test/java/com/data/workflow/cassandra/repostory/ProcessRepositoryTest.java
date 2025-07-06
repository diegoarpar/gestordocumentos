package com.data.workflow.cassandra.repostory;

import com.data.workflow.cassandra.model.ProcessInformationModel;
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
        ProcessInformationModel model = new ProcessInformationModel(1L, "test");
        ProcessInformationModel model2 = new ProcessInformationModel(2L, "test");
        ProcessInformationModel model3 = new ProcessInformationModel(3L, "test");
        processRepository.saveWithTtl(model, 20);
        processRepository.saveWithTtl(model2, 30);
        processRepository.save(model3);
    }
}
