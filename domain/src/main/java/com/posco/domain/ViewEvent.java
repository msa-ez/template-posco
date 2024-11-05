forEach: ViewEventInfo
representativeFor: View
fileName: {{namePascalCase}}.java
path: {{boundedContext.name}}/domain/{{{options.packagePath}}}/domain
---
package {{options.package}}.domain;

import {{options.package}}.infra.AbstractEvent;
import lombok.Data;
import java.util.*;
import java.time.LocalDate;
{{#checkBigDecimal fieldDescriptors}}{{/checkBigDecimal}}

@Data
public class {{namePascalCase}} extends AbstractEvent {

    {{#fieldDescriptors}}
    private {{{className}}} {{name}};
    {{/fieldDescriptors}}
}

<function>
window.$HandleBars.registerHelper('checkDateType', function (fieldDescriptors) {
    for(var i = 0; i < fieldDescriptors.length; i ++ ){
        if(fieldDescriptors[i] && fieldDescriptors[i].className == 'Date'){
            return "import java.util.Date; \n"
        }
    }
});

window.$HandleBars.registerHelper('checkBigDecimal', function (fieldDescriptors) {
    for(var i = 0; i < fieldDescriptors.length; i ++ ){
        if(fieldDescriptors[i] && fieldDescriptors[i].className.includes('BigDecimal')){
            return "import java.math.BigDecimal;";
        }
    }
});
</function>