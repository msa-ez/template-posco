path: oauth/src/main/java/com/example/template/service
fileName: UserDetailsServiceImpl.java
---
package com.example.template.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;

import com.example.template.entity.User;
import com.example.template.repository.UserRepository;
import com.example.template.repository.mybatis.UserMapper;

import javax.annotation.PostConstruct;
import java.util.Optional;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private WebApplicationContext applicationContext;
	private UserRepository repository;

	@Autowired
    private UserMapper userMapper;

	@PostConstruct
	public void completeSetup() {
		repository = applicationContext.getBean(UserRepository.class);
	}

	// Spring Security 정의된 인터페이스 & 메서드로 인증 과정에서 자동으로 호출됨
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByUsername(username)
            .map(user -> {
                user.setAuthorities(AuthorityUtils.createAuthorityList(String.valueOf(user.getRole())));
                return user;
            })
            .orElseThrow(() -> new UsernameNotFoundException("Invalid resource owner, please check resource owner info !"));
		
		// mapper를 통한 조회
		// return userMapper.findByUsernameWithRoles(username)
		// 	.map(user -> {
		// 		user.setAuthorities(AuthorityUtils.createAuthorityList(String.valueOf(user.getRole())));
		// 		return user;
		// 	})
		// 	.orElseThrow(() -> new UsernameNotFoundException("Invalid resource owner"));
    }

}
