forEach: Aggregate
representativeFor: Aggregate
fileName: {{namePascalCase}}RepositoryService.java
path: {{boundedContext.name}}/s20a01-service/src/main/java/com/posco/{{boundedContext.name}}/s20a01/service
---
package com.posco.{{boundedContext.name}}.s20a01.service;

import com.posco.{{boundedContext.name}}.s20a01.domain.{{nameCamelCase}}.{{namePascalCase}};
import com.posco.{{boundedContext.name}}.s20a01.domain.{{nameCamelCase}}.{{namePascalCase}}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import com.posco.{{boundedContext.name}}.s20a01.domain.{{nameCamelCase}}.mybatis.{{namePascalCase}}Mapper;
{{#commands}}
import com.posco.{{boundedContext.name}}.s20a01.domain.{{../nameCamelCase}}.{{namePascalCase}}Command;
{{/commands}}

@Service
@Transactional
public class {{namePascalCase}}RepositoryService {
    private final {{namePascalCase}}Repository {{nameCamelCase}}Repository;
    private final {{namePascalCase}}Mapper mybatisMapper;
    
    @Autowired
    public {{namePascalCase}}RepositoryService(
        {{namePascalCase}}Repository {{nameCamelCase}}Repository,
        {{namePascalCase}}Mapper mybatisMapper) {
        this.{{nameCamelCase}}Repository = {{nameCamelCase}}Repository;
        this.mybatisMapper = mybatisMapper;
    }

    {{#commands}}
    {{#if isRestRepository}}
    {{#ifEquals restRepositoryInfo.method 'POST'}}
    public {{../namePascalCase}} create({{namePascalCase}}Command command) {
        {{../namePascalCase}} {{../nameCamelCase}} = new {{../namePascalCase}}();
        {{#fieldDescriptors}}
        {{../../nameCamelCase}}.set{{pascalCase nameCamelCase}}(command.get{{pascalCase nameCamelCase}}());
        {{/fieldDescriptors}}
        return {{../nameCamelCase}}Repository.save({{../nameCamelCase}});
    }
    {{/ifEquals}}

    {{#ifEquals restRepositoryInfo.method 'PATCH'}}
    public {{../namePascalCase}} update({{../keyFieldDescriptor.className}} id, {{namePascalCase}}Command command) {
        {{../namePascalCase}} existing = findById(id);
        {{#fieldDescriptors}}
        if (command.get{{pascalCase nameCamelCase}}() != null) {
            existing.set{{pascalCase nameCamelCase}}(command.get{{pascalCase nameCamelCase}}());
        }
        {{/fieldDescriptors}}
        return {{../nameCamelCase}}Repository.save(existing);
    }
    {{/ifEquals}}

    {{#ifEquals restRepositoryInfo.method 'DELETE'}}
    public void delete({{../keyFieldDescriptor.className}} id) {
        {{../namePascalCase}} {{../nameCamelCase}} = findById(id);
        {{../nameCamelCase}}Repository.delete({{../nameCamelCase}});
    }
    {{/ifEquals}}
    {{/if}}
    {{/commands}}

    public {{namePascalCase}} save({{namePascalCase}} {{nameCamelCase}}) {
        return {{nameCamelCase}}Repository.save({{nameCamelCase}});
    }

    public List<{{namePascalCase}}> findAll() {
        return {{nameCamelCase}}Repository.findAll();
    }

    public {{namePascalCase}} findById({{keyFieldDescriptor.className}} id) {
        return {{nameCamelCase}}Repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "{{namePascalCase}} not found"));
    }


    //// mybatis
    // 예시
    // mybatisMapper.select{{namePascalCase}}List();
    // mybatisMapper.select{{namePascalCase}}({{keyFieldDescriptor.className}} id);
}