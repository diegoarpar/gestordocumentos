package com.data.customer.user.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserModel{
    private @Id  @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    private String name;
    private @OneToMany(cascade = CascadeType.ALL) List<RoleModel> roleModelList;
    private @OneToMany(cascade = CascadeType.ALL) List<PasswordModel> passwordModels;
    private @OneToMany(cascade = CascadeType.ALL) List<Organization> organizations;
}
