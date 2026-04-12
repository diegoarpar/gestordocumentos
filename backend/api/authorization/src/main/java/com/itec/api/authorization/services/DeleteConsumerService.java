package com.itec.api.authorization.services;

import com.data.authorization.service.ServiceConsumerRepository;
import com.itec.api.authorization.model.ConsumerServiceRequest;
import com.itec.api.authorization.model.ConsumerServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Delete a consumer.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class DeleteConsumerService implements BaseService<ConsumerServiceRequest, ConsumerServiceResponse> {

    private final ServiceConsumerRepository serviceConsumerRepository;

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public ConsumerServiceResponse execute(ConsumerServiceRequest information) {
        serviceConsumerRepository.delete(information.getId());

        var response = new ConsumerServiceResponse();
        response.setTenant(information.getTenant());
        return response;
    }
}
