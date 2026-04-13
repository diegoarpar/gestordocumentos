package com.data.authorization.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ConsumerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String consumerId;
    private String username;
    private String password;
    private String secret;
    private String scopes;
}
