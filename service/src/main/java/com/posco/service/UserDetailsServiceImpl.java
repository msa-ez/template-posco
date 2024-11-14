path: {{name}}/s20a01-service/src/main/java/com/posco/{{name}}/s20a01/service
fileName: UserDetailsServiceImpl.java
---
package com.posco.{{name}}.s20a01.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.posco.{{name}}.s20a01.domain.User;
import com.posco.{{name}}.s20a01.domain.UserRepository;
import org.springframework.web.context.WebApplicationContext;

import javax.annotation.PostConstruct;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private WebApplicationContext applicationContext;
	private UserRepository repository;

	@PostConstruct
	public void completeSetup() {
		repository = applicationContext.getBean(UserRepository.class);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByUsername(username)
            .map(user -> {
                user.setAuthorities(AuthorityUtils.createAuthorityList(String.valueOf(user.getRole())));
                return user;
            })
            .orElseThrow(() -> new UsernameNotFoundException("Invalid resource owner, please check resource owner info !"));
    }

}
