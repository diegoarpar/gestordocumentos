package com.itec.api.authorization.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;
import net.minidev.json.annotate.JsonIgnore;

/**
 * Consumer request.
 */
@Data
public class ConsumerServiceRequest implements BaseServiceRequest {

    private String tenant;

    private Long id;
    private String consumerId;
    private String username;

    @JsonIgnore
    private String password;

    private String secret;
}