package com.data.user.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInformation {
    private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    @Column(unique = true)
    private String name;
    private boolean active = true;
    private @OneToMany(cascade = CascadeType.MERGE) List<RoleInformation> roleModelList;
    private @OneToMany(cascade = CascadeType.MERGE) List<CredentialInformation> passwordModels;
    private @OneToMany(cascade = CascadeType.MERGE) List<OrganizationInformation> organizations;
}
