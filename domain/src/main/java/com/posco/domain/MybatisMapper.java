forEach: Aggregate
representativeFor: Aggregate
fileName: {{namePascalCase}}Mapper.java
path: {{boundedContext.name}}/s20a01-domain/src/main/java/com/posco/{{boundedContext.name}}/s20a01/domain/{{nameCamelCase}}/mybatis
---
package com.posco.{{boundedContext.name}}.s20a01.domain.{{nameCamelCase}}.mybatis;

{{#attached 'View' this}}
{{#if queryParameters}}
import com.posco.{{boundedContext.name}}.s20a01.domain.{{aggregate.nameCamelCase}}.mybatis.{{namePascalCase}}MybatisEntity;
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