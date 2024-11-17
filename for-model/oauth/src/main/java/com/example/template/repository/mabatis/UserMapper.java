package com.example.template.repository.mybatis;

import com.example.template.entity.User;
import org.apache.ibatis.annotations.Mapper;
import java.util.Optional;

@Mapper
public interface UserMapper {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameWithRoles(String username);
    void save(User user);
}