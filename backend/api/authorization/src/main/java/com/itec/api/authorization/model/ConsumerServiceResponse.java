package com.itec.api.authorization.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

import java.util.List;

/**
 * Consumer response.
 */
@Data
public class ConsumerServiceResponse implements BaseServiceResponse {

    private String tenant;
    private Long id;
    private String consumerId;
    private String username;
    private String secret;
    private List<ConsumerServiceResponse> consumers;
}
