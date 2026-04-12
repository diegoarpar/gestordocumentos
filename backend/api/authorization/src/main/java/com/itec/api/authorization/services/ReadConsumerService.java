package com.itec.api.authorization.services;

import com.data.authorization.service.ServiceConsumerRepository;
import com.itec.api.authorization.model.ConsumerServiceRequest;
import com.itec.api.authorization.model.ConsumerServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Read consumers.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class ReadConsumerService implements BaseService<ConsumerServiceRequest, ConsumerServiceResponse> {

    private final ServiceConsumerRepository serviceConsumerRepository;

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public ConsumerServiceResponse execute(ConsumerServiceRequest information) {
        var entities = serviceConsumerRepository.readAll(null);

        var consumers = entities.stream().map(entity -> {
            var item = new ConsumerServiceResponse();
            item.setId(entity.getId());
            item.setConsumerId(entity.getConsumerId());
            item.setUsername(entity.getUsername());
            item.setSecret(entity.getSecret());
            return item;
        }).toList();

        var response = new ConsumerServiceResponse();
        response.setTenant(information.getTenant());
        response.setConsumers(consumers);
        return response;
    }

    /**
     * Execute the service
     * @param consumerId the information
     */
    public ConsumerServiceResponse readByConsumerId(String consumerId) {
        var entities = serviceConsumerRepository.readByConsumerId(consumerId);

        var consumers = entities.stream().map(entity -> {
            var item = new ConsumerServiceResponse();
            item.setId(entity.getId());
            item.setConsumerId(entity.getConsumerId());
            item.setUsername(entity.getUsername());
            item.setSecret(entity.getSecret());
            return item;
        }).toList();

        var response = new ConsumerServiceResponse();
        response.setConsumers(consumers);
        return response;
    }
}
