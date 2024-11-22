forEach: View
representativeFor: View
fileName: {{namePascalCase}}MybatisEntity.java
path: {{boundedContext.name}}/{{option.package}}-domain/src/main/java/com/posco/{{boundedContext.name}}/{{option.package}}/domain/{{aggregate.nameCamelCase}}/mybatis
---
package com.posco.{{boundedContext.name}}.{{option.package}}.domain.{{aggregate.nameCamelCase}}.mybatis;

import lombok.Data;
import java.util.Date;

{{#queryParameters}}{{^if (isPrimitive className)}}import com.posco.{{../boundedContext.name}}.{{option.package}}.domain.{{namePascalCase}};{{/if}}{{/queryParameters}}


@Data
public class {{namePascalCase}}MybatisEntity {
    {{#queryParameters}}
        private {{className}} {{nameCamelCase}};
    {{/queryParameters}}
}

<function>
window.$HandleBars.registerHelper('isPrimitive', function (className) {
    if(className.includes("String") || className.includes("Integer") || className.includes("Long") || className.includes("Double") || className.includes("Float")
            || className.includes("Boolean") || className.includes("Date") || className.includes("int")){
        return true;
    } else {
        return false;
    }
});
</function>