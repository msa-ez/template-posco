forEach: View
representativeFor: View
fileName: {{namePascalCase}}MybatisEntity.java
path: {{boundedContext.name}}/s20a01-domain/src/main/java/com/posco/{{boundedContext.name}}/s20a01/domain/{{aggregate.nameCamelCase}}/mybatis
---
package com.posco.{{boundedContext.name}}.s20a01.domain.{{aggregate.nameCamelCase}}.mybatis;

import lombok.Data;
import java.util.Date;

{{#queryParameters}}{{#isVO}}import com.posco.{{../boundedContext.name}}.s20a01.domain.{{namePascalCase}};{{/isVO}}{{/queryParameters}}


@Data
public class {{namePascalCase}}MybatisEntity {
    {{#queryParameters}}
        private {{className}} {{nameCamelCase}};
    {{/queryParameters}}
}