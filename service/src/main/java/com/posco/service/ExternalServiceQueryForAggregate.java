forEach: Relation
fileName: {{target.aggregate.namePascalCase}}Service.java
path: {{source.boundedContext.name}}/service/{{options.packagePath}}/service
except: {{contexts.except}}
---

package {{options.package}}.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Date;
import java.util.List;


{{#if value.fallback}}
@FeignClient(name = "{{target.boundedContext.name}}", url = "{{apiVariable target.boundedContext.name}}", fallback = {{target.aggregate.namePascalCase}}ServiceImpl.class)
{{else}}
@FeignClient(name = "{{target.boundedContext.name}}", url = "{{apiVariable target.boundedContext.name}}")
{{/if}}
 
{{#target}}
public interface {{aggregate.namePascalCase}}Service {
    {{#if queryOption.multipleResult}}
    {{#if queryOption.useDefaultUri}}
    @GetMapping(path="/{{aggregate.namePlural}}/search/{{#if queryOption.apiPath}}{{queryOption.apiPath}}{{else}}{{nameCamelCase}}{{/if}}")
    public List<{{aggregate.namePascalCase}}> {{nameCamelCase}}({{#queryParameters}}{{className}} {{nameCamelCase}}{{#unless @last}},{{/unless}}{{/queryParameters}});
    {{else}}
    @GetMapping(path="/{{aggregate.namePlural}}/{{#if queryOption.apiPath}}{{queryOption.apiPath}}{{else}}{{nameCamelCase}}{{/if}}")
    public List<{{aggregate.namePascalCase}}> {{#if queryOption.apiPath}}{{queryOption.apiPath}}{{else}}{{nameCamelCase}}{{/if}}({{namePascalCase}}Query {{nameCamelCase}}Query);
    {{/if}}
    {{else}}
    {{#if queryOption.useDefaultUri}}
    @GetMapping(path="/{{aggregate.namePlural}}/{{#addMustache aggregate.keyFieldDescriptor.nameCamelCase}}{{/addMustache}}")
    public {{aggregate.namePascalCase}} {{nameCamelCase}} (@PathVariable ("{{aggregate.keyFieldDescriptor.nameCamelCase}}") {{aggregate.keyFieldDescriptor.className}} {{aggregate.keyFieldDescriptor.nameCamelCase}});
    {{else}} 
    @GetMapping(path="/{{aggregate.namePlural}}/{{#if queryOption.apiPath}}{{queryOption.apiPath}}{{else}}{{nameCamelCase}}{{/if}}")
    public {{aggregate.namePascalCase}} {{#if queryOption.apiPath}}{{queryOption.apiPath}}{{else}}{{nameCamelCase}}{{/if}}({{namePascalCase}}Query {{nameCamelCase}}Query);
    {{/if}}
    {{/if}}

}

{{/target}}



<function>
 

    let isGetInvocation = ((this.source._type.endsWith("Command") || this.source._type.endsWith("Policy")) && (this.target._type.endsWith("View") && this.target.dataProjection==("query-for-aggregate")))
    let isPostInvcation = ((this.source._type.endsWith("Event") || this.source._type.endsWith("Policy")) && this.target._type.endsWith("Command"))
    let isExternalInvocation = (this.source.boundedContext.name != this.target.boundedContext.name)

    this.contexts.except = !(isExternalInvocation && isGetInvocation)
 
if(!this.contexts.except){
 
}
window.$HandleBars.registerHelper('changeUpper', function (name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
});

window.$HandleBars.registerHelper('addMustache', function (name) {
    var keyName = ''
    keyName = "{" + name + "}"
    return keyName
});

window.$HandleBars.registerHelper('checkKeyParameter', function (view) {
    var idType = ""
    for( var i = 0; i < view.queryParameters.length; i++){
        if(view.queryParameters[i].isKey){
            idType = `("${view.queryParameters[i].nameCamelCase}") ` + view.queryParameters[i].className + " " + view.queryParameters[i].nameCamelCase
            
        }else{
            idType = "(id) " + view.aggregate.keyFieldDescriptor.className + " " + view.aggregate.keyFieldDescriptor.nameCamelCase
            
        }
        return idType
    }
});
 
</function>