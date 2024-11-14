path: {{name}}/s20a01-domain/src/main/java/com/posco/{{name}}/s20a01/domain
fileName: UserRepository.java
---
package com.posco.{{name}}.s20a01.domain;

import com.posco.{{name}}.s20a01.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
}
