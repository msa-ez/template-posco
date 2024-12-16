forEach: Aggregate
representativeFor: Aggregate
fileName: {{namePascalCase}}Service.java
path: {{boundedContext.name}}/{{options.package}}-domain/src/main/java/com/posco/{{boundedContext.name}}/{{options.package}}/domain/{{nameCamelCase}}
---
package com.posco.{{boundedContext.name}}.{{options.package}}.domain.{{nameCamelCase}};

import com.posco.{{boundedContext.name}}.{{options.package}}.domain.{{nameCamelCase}}.{{namePascalCase}};
import com.posco.{{boundedContext.name}}.{{options.package}}.domain.{{nameCamelCase}}.{{namePascalCase}}Repository;
import com.posco.{{boundedContext.name}}.{{options.package}}.domain.{{nameCamelCase}}.mybatis.{{namePascalCase}}Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.BeanUtils;
{{#attached 'View' this}}
import com.posco.{{boundedContext.name}}.{{../options.package}}.domain.{{aggregate.nameCamelCase}}.mybatis.{{namePascalCase}}Response;
import com.posco.{{boundedContext.name}}.{{../options.package}}.domain.{{aggregate.nameCamelCase}}.mybatis.{{namePascalCase}}DTO;
{{/attached}}
{{#commands}}
import com.posco.{{boundedContext.name}}.{{../options.package}}.domain.{{../nameCamelCase}}.{{namePascalCase}}Command;
{{/commands}}

@Service
@Transactional
public class {{namePascalCase}}Service {
    private final {{namePascalCase}}Repository {{nameCamelCase}}Repository;
    private final {{namePascalCase}}Mapper {{nameCamelCase}}Mapper;
    
    @Autowired
    public {{namePascalCase}}Service(
        {{namePascalCase}}Repository {{nameCamelCase}}Repository
        ,{{namePascalCase}}Mapper {{nameCamelCase}}Mapper) {
        this.{{nameCamelCase}}Repository = {{nameCamelCase}}Repository;
        this.{{nameCamelCase}}Mapper = {{nameCamelCase}}Mapper;
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

    {{#ifEquals restRepositoryInfo.method 'PUT'}}
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


    //// readModel mybatis
    {{#attached 'View' this}}
    {{#if queryParameters}}
    public {{namePascalCase}}Response {{nameCamelCase}}({{namePascalCase}}DTO dto) {
        {{namePascalCase}}Response response = {{../nameCamelCase}}Mapper.{{nameCamelCase}}(dto);
        if (response == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "{{namePascalCase}} not found");
        }
        return response;
    }
    {{/if}}
    {{/attached}}
}
