path: oauth/src/main/java/com/example/template/service
fileName: AuthController.java
---
package com.example.template.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.template.config.OAuth2AuthorizationServerConfig;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import java.util.Arrays;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private OAuth2AuthorizationServerConfig oAuth2Config;

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestParam String username, @RequestParam String password) {
        try {
            // 인증 처리
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(username, password);
            
            Authentication authentication = authenticationManager.authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 여기서 추가 정보 조회
            // Optional<User> userDetails = userMapper.findByUsernameWithRoles(username);
            // if (!userDetails.isPresent()) {
            //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            //         .body(new ApiResponse(false, "User details not found"));
            // }

            OAuth2Request oAuth2Request = new OAuth2Request(null, 
                OAuth2AuthorizationServerConfig.CLIENT_ID, 
                null, true, null, null, null, null, null);
            
            OAuth2Authentication oAuth2Authentication = 
                new OAuth2Authentication(oAuth2Request, authentication);

            TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
            tokenEnhancerChain.setTokenEnhancers(Arrays.asList(
                oAuth2Config.tokenEnhancer(), 
                oAuth2Config.accessTokenConverter()
            ));
            
            OAuth2AccessToken accessToken = tokenEnhancerChain.enhance(
                new DefaultOAuth2AccessToken(UUID.randomUUID().toString()), 
                oAuth2Authentication
            );
            
            return ResponseEntity.ok(new JwtAuthenticationResponse(
                accessToken.getValue(),
                accessToken.getTokenType(),
                accessToken.getExpiresIn()
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "Invalid username or password"));
        }
    }

    public static class JwtAuthenticationResponse {
        private String accessToken;
        private String tokenType;
        private int expiresIn;

        public JwtAuthenticationResponse(String accessToken, String tokenType, int expiresIn) {
            this.accessToken = accessToken;
            this.tokenType = tokenType;
            this.expiresIn = expiresIn;
        }

        // Getters and setters
        public String getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        public String getTokenType() {
            return tokenType;
        }

        public void setTokenType(String tokenType) {
            this.tokenType = tokenType;
        }

        public int getExpiresIn() {
            return expiresIn;
        }

        public void setExpiresIn(int expiresIn) {
            this.expiresIn = expiresIn;
        }
    }

    public static class ApiResponse {
        private boolean success;
        private String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        // Getters and setters
        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
