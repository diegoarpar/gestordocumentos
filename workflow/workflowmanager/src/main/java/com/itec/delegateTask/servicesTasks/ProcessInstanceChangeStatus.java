package com.itec.delegateTask.servicesTasks;

import com.itec.configuration.ConfigurationApp;
import com.itec.db.DBMongo;
import com.mongodb.BasicDBObject;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.JavaDelegate;

import java.io.IOException;

public class ProcessInstanceChangeStatus implements JavaDelegate {

    private Expression newStatus;
    String collectionInstanceInformation="instanceInformation";
    @Override
    public void execute(DelegateExecution delegateExecution) {
        String user = delegateExecution.getVariable("user").toString();
        String processInstanceStatus = delegateExecution.getVariable("processInstanceStatus").toString();
        String tenant = delegateExecution.getVariable("tenant").toString();
        String procesInstanceId = delegateExecution.getParent().getProcessInstanceId();
        String newStatus2= newStatus.getValue(delegateExecution).toString();
        try {

            DBMongo.update(collectionInstanceInformation
                    ,new BasicDBObject().append("processInstanceId",procesInstanceId)
                    ,new BasicDBObject().append("$set"
                            ,new BasicDBObject().append("processInstanceStatus",newStatus2))
                    ,tenant);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
