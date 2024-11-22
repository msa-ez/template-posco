path: {{name}}/{{option.package}}-boot/src/main/java/com/posco/{{name}}/{{option.package}}
fileName: {{namePascalCase}}Application.java
---
package com.posco.{{name}}.{{option.package}};
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