forEach: Aggregate
representativeFor: Aggregate
fileName: {{namePascalCase}}Controller.java
path: {{boundedContext.name}}/s20a01-service/src/main/java/com/posco/{{boundedContext.name}}/s20a01/service
---
package com.posco.{{boundedContext.name}}.s20a01.service;

import com.posco.{{boundedContext.name}}.s20a01.domain.{{namePascalCase}};
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import javax.validation.Valid;
import org.springframework.data.rest.webmvc.RepositoryRestController;

@RepositoryRestController
public class {{namePascalCase}}Controller {
    private final {{namePascalCase}}RepositoryService {{nameCamelCase}}RepositoryService;

    @Autowired
    public {{namePascalCase}}Controller({{namePascalCase}}RepositoryService {{nameCamelCase}}RepositoryService) {
        this.{{nameCamelCase}}RepositoryService = {{nameCamelCase}}RepositoryService;
    }

    {{#commands}}
    {{#if isRestRepository}}
    {{#ifEquals restRepositoryInfo.method 'POST'}}
    @PostMapping(path = "/{{../namePlural}}")
    public ResponseEntity<{{../namePascalCase}}> create(@Valid @RequestBody {{namePascalCase}}Command command) {
        return ResponseEntity.ok({{../nameCamelCase}}RepositoryService.create(command));
    }
    {{/ifEquals}}

    {{#ifEquals restRepositoryInfo.method 'PATCH'}}
    @PatchMapping(path = "{{../namePlural}}/{id}")
    public ResponseEntity<{{../namePascalCase}}> update(
        @PathVariable {{../keyFieldDescriptor.className}} id,
        @Valid @RequestBody {{namePascalCase}}Command command) {
        return ResponseEntity.ok({{../nameCamelCase}}RepositoryService.update(id, command));
    }
    {{/ifEquals}}

    {{#ifEquals restRepositoryInfo.method 'DELETE'}}
    @DeleteMapping(path = "{{../namePlural}}/{id}")
    public ResponseEntity<Void> delete(@PathVariable {{../keyFieldDescriptor.className}} id) {
        {{../nameCamelCase}}RepositoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
    {{/ifEquals}}
    
    {{else}}
    @PostMapping(path = "{{../namePlural}}/{id}/{{nameCamelCase}}")
    public ResponseEntity<{{../namePascalCase}}> {{nameCamelCase}}(
        @PathVariable("id") {{../keyFieldDescriptor.className}} id,
        @Valid @RequestBody {{namePascalCase}}Command command) {
        {{../namePascalCase}} {{../nameCamelCase}} = {{../nameCamelCase}}RepositoryService.findById(id);
        
        // 도메인 포트 메서드 직접 호출
        {{../nameCamelCase}}.{{nameCamelCase}}(
            {{#fieldDescriptors}}
            {{^isKey}}
            command.get{{pascalCase nameCamelCase}}(){{^@last}},{{/@last}}
            {{/isKey}}
            {{/fieldDescriptors}}
        );
        
        return ResponseEntity.ok({{../nameCamelCase}}RepositoryService.save({{../nameCamelCase}}));
    }
    {{/if}}
    {{/commands}}
}