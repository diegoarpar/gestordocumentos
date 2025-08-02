package com.data.user.model;

import jakarta.persistence.Entity;
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
    private @Id Long id;
    private String name;
    private @OneToMany List<RoleModel> roleModelList;
    private @OneToMany List<PasswordModel> passwordModels;
}
