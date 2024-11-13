forEach: Aggregate
representativeFor: Aggregate
fileName: {{namePascalCase}}Mapper.java
path: {{boundedContext.name}}/s20a01-domain/src/main/java/com/posco/{{boundedContext.name}}/s20a01/domain/mybatis
---
package com.posco.{{boundedContext.name}}.s20a01.domain.{{nameCamelCase}}.mybatis;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface {{namePascalCase}}Mapper {
    // 예시
    // List<{{namePascalCase}}MybatisEntity> select{{namePascalCase}}List();
    // {{namePascalCase}}MybatisEntity select{{namePascalCase}}({{keyFieldDescriptor.className}} id);
}