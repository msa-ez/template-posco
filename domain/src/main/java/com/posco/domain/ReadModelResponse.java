forEach: View
representativeFor: View
fileName: {{namePascalCase}}Response.java
path: {{boundedContext.name}}/{{options.package}}-domain/src/main/java/com/posco/{{boundedContext.name}}/{{options.package}}/domain/{{aggregate.nameCamelCase}}/mybatis
---
package com.posco.{{boundedContext.name}}.{{options.package}}.domain.{{aggregate.nameCamelCase}}.mybatis;

import lombok.Data;
import java.util.Date;

{{#fieldDescriptors}}{{^if (isPrimitive className)}}import com.posco.{{../boundedContext.name}}.{{../options.package}}.domain.{{className}};{{/if}}{{/fieldDescriptors}}


@Data
public class {{namePascalCase}}Response {
    {{#fieldDescriptors}}
        private {{className}} {{nameCamelCase}};
    {{/fieldDescriptors}}
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