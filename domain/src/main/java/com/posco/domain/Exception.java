forEach: Exception
fileName: {{pascalCase name}}.java
path: {{boundedContext.name}}/domain/{{{options.packagePath}}}/domain
---
package {{options.package}}.domain;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;


@ResponseStatus(code = HttpStatus.{{httpStatus}}, reason="{{message}}")
public class {{pascalCase name}} extends RuntimeException{

    public {{pascalCase name}}() {
        super("{{message}}");
        
    }
}
