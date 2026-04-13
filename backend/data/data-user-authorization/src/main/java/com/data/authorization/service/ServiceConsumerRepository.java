package com.data.authorization.service;

import com.data.authorization.model.ConsumerEntity;
import com.data.authorization.respository.ConsumerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceConsumerRepository {

    private final ConsumerRepository repository;

    public ConsumerEntity save(ConsumerEntity model) {
        return repository.save(model);
    }

    public ConsumerEntity readByName(ConsumerEntity model) {
        return null;
    }

    public List<ConsumerEntity> readByConsumerId(String consumerId) {
        return repository.findByConsumerId(consumerId);
    }

    public ConsumerEntity readByOrigin(ConsumerEntity model) {
        return null;
    }

    public List<ConsumerEntity> readAll(ConsumerEntity model) {
        return (List<ConsumerEntity>) repository.findAll();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
