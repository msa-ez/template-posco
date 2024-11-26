forEach: Aggregate
representativeFor: Aggregate
fileName: {{namePascalCase}}Mapper.java
path: {{boundedContext.name}}/{{options.package}}-domain/src/main/java/com/posco/{{boundedContext.name}}/{{options.package}}/domain/{{nameCamelCase}}/mybatis
---
package com.posco.{{boundedContext.name}}.{{options.package}}.domain.{{nameCamelCase}}.mybatis;

{{#attached 'View' this}}
{{#if queryParameters}}
import com.posco.{{boundedContext.name}}.{{options.package}}.domain.{{aggregate.nameCamelCase}}.mybatis.{{namePascalCase}}Response;
import com.posco.{{boundedContext.name}}.{{options.package}}.domain.{{aggregate.nameCamelCase}}.mybatis.{{namePascalCase}}DTO;
{{/if}}
{{/attached}}

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface {{namePascalCase}}Mapper {

{{#attached 'View' this}}
    {{#if queryParameters}}
        {{namePascalCase}}Response {{nameCamelCase}}({{../keyFieldDescriptor.className}} id, {{namePascalCase}}DTO dto);
    {{/if}}
{{/attached}}
}