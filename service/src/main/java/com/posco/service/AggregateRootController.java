forEach: Aggregate
representativeFor: Aggregate
fileName: {{namePascalCase}}Controller.java
path: {{boundedContext.name}}/s20a01-service/src/main/java/com/posco/{{boundedContext.name}}/s20a01/service
---
package com.posco.{{boundedContext.name}}.s20a01.service;

import com.posco.{{boundedContext.name}}.s20a01.domain.{{nameCamelCase}}.{{namePascalCase}};
import com.posco.{{boundedContext.name}}.s20a01.domain.{{nameCamelCase}}.{{namePascalCase}}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import javax.validation.Valid;
import org.springframework.data.rest.webmvc.RepositoryRestController;
{{#commands}}
import com.posco.{{boundedContext.name}}.s20a01.domain.{{../nameCamelCase}}.{{namePascalCase}}Command;
{{/commands}}

@RepositoryRestController
public class {{namePascalCase}}Controller {
    private final {{namePascalCase}}Service {{nameCamelCase}}Service;

    @Autowired
    public {{namePascalCase}}Controller({{namePascalCase}}Service {{nameCamelCase}}Service) {
        this.{{nameCamelCase}}Service = {{nameCamelCase}}Service;
    }

    @GetMapping(path = "/{{namePlural}}")
    public ResponseEntity<List<{{namePascalCase}}>> findAll() {
        return ResponseEntity.ok({{nameCamelCase}}Service.findAll());
    }

    {{#commands}}
    {{#if isRestRepository}}
    {{#ifEquals restRepositoryInfo.method 'POST'}}
    @PostMapping(path = "/{{../namePlural}}")
    public ResponseEntity<{{../namePascalCase}}> create(@Valid @RequestBody {{namePascalCase}}Command command) {
        return ResponseEntity.ok({{../nameCamelCase}}Service.create(command));
    }
    {{/ifEquals}}

    {{#ifEquals restRepositoryInfo.method 'PATCH'}}
    @PatchMapping(path = "/{{../namePlural}}/{{#addMustache ../keyFieldDescriptor.nameCamelCase}}{{/addMustache}}")
    public ResponseEntity<{{../namePascalCase}}> update(
        @PathVariable {{../keyFieldDescriptor.className}} {{../keyFieldDescriptor.nameCamelCase}},
        @Valid @RequestBody {{namePascalCase}}Command command) {
        return ResponseEntity.ok({{../nameCamelCase}}Service.update({{../keyFieldDescriptor.nameCamelCase}}, command));
    }
    {{/ifEquals}}

    {{#ifEquals restRepositoryInfo.method 'DELETE'}}
    @DeleteMapping(path = "/{{../namePlural}}/{{#addMustache ../keyFieldDescriptor.nameCamelCase}}{{/addMustache}}")
    public ResponseEntity<Void> delete(@PathVariable {{../keyFieldDescriptor.className}} {{../keyFieldDescriptor.nameCamelCase}}) {
        {{../nameCamelCase}}Service.delete({{../keyFieldDescriptor.nameCamelCase}});
        return ResponseEntity.noContent().build();
    }
    {{/ifEquals}}
    
    {{else}}
    @PostMapping(path = "/{{../namePlural}}/{{namePascalCase}}/{{#addMustache ../keyFieldDescriptor.nameCamelCase}}{{/addMustache}}/{{nameCamelCase}}")
    public ResponseEntity<{{../namePascalCase}}> {{nameCamelCase}}(
        @PathVariable("{{../keyFieldDescriptor.nameCamelCase}}") {{../keyFieldDescriptor.className}} {{../keyFieldDescriptor.nameCamelCase}},
        @Valid @RequestBody {{namePascalCase}}Command command) {
        {{../namePascalCase}} {{../nameCamelCase}} = {{../nameCamelCase}}Service.findById({{../keyFieldDescriptor.nameCamelCase}});
        
        // 도메인 포트 메서드 직접 호출
        {{../nameCamelCase}}.{{nameCamelCase}}(
            command
        );
        
        return ResponseEntity.ok({{../nameCamelCase}}Service.save({{../nameCamelCase}}));
    }
    {{/if}}
    {{/commands}}

    {{#attached 'View' this}}
    {{#if queryParameters}}
    @GetMapping(path = "/{{../namePlural}}/{{namePascalCase}}/{{#addMustache ../keyFieldDescriptor.nameCamelCase}}{{/addMustache}}")
    public ResponseEntity<{{../namePascalCase}}> {{nameCamelCase}}(@PathVariable {{../keyFieldDescriptor.className}} {{../keyFieldDescriptor.nameCamelCase}}) {
        return ResponseEntity.ok({{../nameCamelCase}}Service.{{nameCamelCase}}({{../keyFieldDescriptor.nameCamelCase}}));
    }
    {{/if}}
    {{/attached}}
}
<function>
window.$HandleBars.registerHelper('addMustache', function (id) {
    var result = '';
    result = "{" + id + "}"
    return result;
});
</function>