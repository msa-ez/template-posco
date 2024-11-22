forEach: Aggregate
representativeFor: Aggregate
fileName: {{namePascalCase}}Mapper.java
path: {{boundedContext.name}}/{{option.package}}-domain/src/main/java/com/posco/{{boundedContext.name}}/{{option.package}}/domain/{{nameCamelCase}}/mybatis
---
package com.posco.{{boundedContext.name}}.{{option.package}}.domain.{{nameCamelCase}}.mybatis;

{{#attached 'View' this}}
{{#if queryParameters}}
import com.posco.{{boundedContext.name}}.{{option.package}}.domain.{{aggregate.nameCamelCase}}.mybatis.{{namePascalCase}}MybatisEntity;
{{/if}}
{{/attached}}

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface {{namePascalCase}}Mapper {

{{#attached 'View' this}}
    {{#if queryParameters}}
        {{namePascalCase}}MybatisEntity {{nameCamelCase}}({{../keyFieldDescriptor.className}} id);
    {{/if}}
{{/attached}}
}