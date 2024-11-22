forEach: Command
representativeFor: Command
fileName: {{namePascalCase}}Command.java
path: {{boundedContext.name}}/{{options.package}}-domain/src/main/java/com/posco/{{boundedContext.name}}/{{options.package}}/domain/{{aggregate.nameCamelCase}}
---
package com.posco.{{boundedContext.name}}.{{options.package}}.domain.{{aggregate.nameCamelCase}};

import java.util.*;
import lombok.Data;
import java.time.LocalDate;
{{#fieldDescriptors}}
{{^if (isPrimitive className)}}
import com.posco.{{../boundedContext.name}}.{{options.package}}.domain.{{removeList className}};
{{/if}}
{{/fieldDescriptors}}
{{#checkBigDecimal fieldDescriptors}}{{/checkBigDecimal}}

@Data
public class {{namePascalCase}}Command {

{{#fieldDescriptors}}
        private {{{className}}} {{nameCamelCase}};
{{/fieldDescriptors}}


}

<function>
window.$HandleBars.registerHelper('except', function (fieldDescriptors) {
    return (fieldDescriptors && fieldDescriptors.length == 0);
});

window.$HandleBars.registerHelper('checkBigDecimal', function (fieldDescriptors) {
    for(var i = 0; i < fieldDescriptors.length; i ++ ){
        if(fieldDescriptors[i] && fieldDescriptors[i].className.includes('BigDecimal')){
            return "import java.math.BigDecimal;";
        }
    }
});

window.$HandleBars.registerHelper('isDefaultVerb', function (command) {
    if(command.isRestRepository){
        return true;
    }
});

window.$HandleBars.registerHelper('isPrimitive', function (className) {
    if(className.includes("String") || className.includes("Integer") || className.includes("Long") || className.includes("Double") || className.includes("Float")
            || className.includes("Boolean") || className.includes("Date") || className.includes("int")){
        return true;
    } else {
        return false;
    }
});

window.$HandleBars.registerHelper('removeList', function (className) {
    if(className.includes("List<")) {
        className = className.replace("List<", "").replace(">", "");
    }
    return className;
});
</function>
