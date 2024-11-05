forEach: View
fileName: {{namePascalCase}}Query.java
path: {{boundedContext.name}}/domain/{{{options.packagePath}}}/domain
except: {{#checkExtend this}}{{/checkExtend}}
---
package {{options.package}}.domain;

import java.util.Date;
import lombok.Data;

@Data
public class {{namePascalCase}}Query {

    {{#queryParameters}}
    private {{className}} {{nameCamelCase}};
    {{/queryParameters}}
}
<function>
window.$HandleBars.registerHelper('checkExtend', function (view) {
    if(view.queryParameters =='' || view.dataProjection == 'cqrs' ){
        return true;
    }else{
        return false;
    }
});
</function>