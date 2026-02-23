package com.data.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleInformation {
    private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    @Column(unique = true)
    private String name;
    private boolean active = true;
}
