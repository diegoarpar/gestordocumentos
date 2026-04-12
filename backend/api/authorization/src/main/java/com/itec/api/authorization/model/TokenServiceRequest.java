package com.itec.api.authorization.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;
import net.minidev.json.annotate.JsonIgnore;

/**
 * User request.
 */
@Data
public class TokenServiceRequest implements BaseServiceRequest {

    /**
     * The tenant.
     */
    private String tenant;

    @JsonIgnore
    private String userAuthorization;

    @JsonIgnore
    private String applicationAuthorization;
}
