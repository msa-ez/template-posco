
forEach: Relation
fileName: {{target.namePascalCase}}Command.java
path: {{source.boundedContext.name}}/domain/{{{options.packagePath}}}/external
except: {{contexts.except}}
---
package {{options.package}}.external;

import javax.persistence.*;
import java.util.List;
import java.util.Date;
import lombok.Data;

@Data
public class {{target.namePascalCase}}Command {

{{#target.fieldDescriptors}}
    {{#isKey}}
    @Id
    {{/isKey}}
    private {{{className}}} {{nameCamelCase}};
{{/target.fieldDescriptors}}
}

<function>
    let isPostInvocation = ((this.source._type.endsWith("Event") || this.source._type.endsWith("Policy")) && this.target._type.endsWith("Command"))
    let isExternalInvocation = (this.source.boundedContext.name != this.target.boundedContext.name)

    this.contexts.except = !(isExternalInvocation && isPostInvocation)
</function>
