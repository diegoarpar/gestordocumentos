package com.itec.api.authorization.services;

import com.data.authorization.model.ConsumerEntity;
import com.data.authorization.service.ServiceConsumerRepository;
import com.itec.api.authorization.model.ConsumerServiceRequest;
import com.itec.api.authorization.model.ConsumerServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Update a consumer.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class UpdateConsumerService implements BaseService<ConsumerServiceRequest, ConsumerServiceResponse> {

    private final ServiceConsumerRepository serviceConsumerRepository;

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public ConsumerServiceResponse execute(ConsumerServiceRequest information) {
        var entity = new ConsumerEntity();
        entity.setId(information.getId());
        entity.setConsumerId(information.getConsumerId());
        entity.setUsername(information.getUsername());
        entity.setPassword(information.getPassword());
        entity.setSecret(information.getSecret());

        var saved = serviceConsumerRepository.save(entity);

        var response = new ConsumerServiceResponse();
        response.setTenant(information.getTenant());
        response.setId(saved.getId());
        response.setConsumerId(saved.getConsumerId());
        response.setUsername(saved.getUsername());
        response.setSecret(saved.getSecret());
        return response;
    }
}
