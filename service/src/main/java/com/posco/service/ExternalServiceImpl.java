forEach: Relation
fileName: {{target.aggregate.namePascalCase}}ServiceImpl.java
path: {{source.boundedContext.name}}/service/{{options.packagePath}}/service
except: {{contexts.except}}
ifDuplicated: merge
---

package {{options.package}}.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;


{{#ifContains "$.target._type" "View"}}
{{#target}}
{{#ifEquals dataProjection "query-for-aggregate"}}
@Service
public class {{aggregate.namePascalCase}}ServiceImpl implements {{aggregate.namePascalCase}}Service {
    {{#if queryOption.multipleResult}}
    public List<{{aggregate.namePascalCase}}> {{nameCamelCase}}({{namePascalCase}}Query query){
        {{aggregate.namePascalCase}} {{aggregate.nameCamelCase}} = new {{aggregate.namePascalCase}}();
        
        List<{{aggregate.namePascalCase}}> list = new ArrayList<{{aggregate.namePascalCase}}>();
        list.add({{aggregate.nameCamelCase}});

        return list;
    }
    {{else}}
    public {{aggregate.namePascalCase}} {{nameCamelCase}}({{namePascalCase}}Query id){
        {{aggregate.namePascalCase}} {{aggregate.nameCamelCase}} = new {{aggregate.namePascalCase}}();
        
        return {{aggregate.nameCamelCase}};
    }
    {{/if}}
{{/ifEquals}}
{{/target}}
{{/ifContains}}
}



<function> 
 
var commandToReadModelOrPolicy = ((this.source._type.endsWith("Command") || this.source._type.endsWith("Policy")) && this.target._type.endsWith("View"))
 this.contexts.except = !(commandToReadModelOrPolicy && this.value.fallback)


if(!this.contexts.except){
 
}
 
</function>