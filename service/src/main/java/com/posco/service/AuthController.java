path: {{name}}/s20a01-service/src/main/java/com/posco/{{name}}/s20a01/service
fileName: AuthController.java
---
package com.posco.{{name}}.s20a01.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private OAuth2AuthorizationServerConfig oAuth2Config;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // OAuth2 토큰 발급 로직 활용
            OAuth2AccessToken accessToken = oAuth2Config.getTokenEndpoint()
                .postAccessToken(loginRequest.getUsername(), loginRequest.getPassword());
            
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
}