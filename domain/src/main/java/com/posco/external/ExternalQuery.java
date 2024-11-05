forEach: Relation
fileName: {{pascalCase target.name}}Query.java
path: {{source.boundedContext.name}}/domain/{{{options.packagePath}}}/external
except: {{contexts.except}}
---

package {{options.package}}.external;

import lombok.Data;
import java.util.Date;
@Data

public class {{target.namePascalCase}}Query {
{{#target}}   
    {{#queryParameters}}
    private {{safeTypeOf className}} {{nameCamelCase}};
    {{/queryParameters}}
{{/target}}
}


<function>
 
this.contexts.except = !(
    (this.source._type.endsWith("Command") || this.source._type.endsWith("Policy")) && 
    (this.target._type.endsWith("View") && this.target.dataProjection=="query-for-aggregate") &&
    (this.target.queryParameters !='') 
)
 
if(!this.contexts.except){  
}
 
</function>