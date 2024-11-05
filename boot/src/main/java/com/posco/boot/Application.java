path: {{name}}/s20a01-boot/src/main/java/com/posco/{{name}}/s20a01
fileName: {{namePascalCase}}Application.java
---
package com.posco.{{name}}.s20a01;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class {{namePascalCase}}Application {
    public static ApplicationContext applicationContext;
    public static void main(String[] args) {
        applicationContext = SpringApplication.run({{namePascalCase}}Application.class, args);
    }
}