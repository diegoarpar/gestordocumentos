package com.itec.delegateTask.servicesTasks;

import com.itec.configuration.ConfigurationApp;
import com.itec.db.DBMongo;
import com.mongodb.BasicDBObject;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.JavaDelegate;

import java.io.IOException;
import java.util.Date;

public class ProcessInstanceChangeStatus implements JavaDelegate {

    private Expression newStatus;
    String collectionInstanceInformation="instanceInformation";
    String collectionTaksInformation="taksInformation";
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
            BasicDBObject criterial = new BasicDBObject();
            criterial.append("action","completeTask");
            criterial.append("actionDate",new Date());
            criterial.append("taskName",delegateExecution.getParent().getCurrentActivityId());
            criterial.append("taskDescription",delegateExecution.getCurrentFlowElement().getName());
            criterial.append("processInstanceId",procesInstanceId);

            DBMongo.insert(collectionTaksInformation,criterial,tenant);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
