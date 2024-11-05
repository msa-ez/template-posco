forEach: Relation
fileName: {{target.aggregate.namePascalCase}}Service.java
path: {{source.boundedContext.name}}/s20a01-service/src/main/java/com/posco/{{source.boundedContext.name}}/s20a01/service
except: {{contexts.except}}
ifDuplicated: merge
---
package com.posco.{{source.boundedContext.name}}.s20a01.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Date;

@FeignClient(name = "{{target.boundedContext.name}}", url = "{{apiVariable target.boundedContext.name}}")
public interface {{target.aggregate.namePascalCase}}Service {
    {{#target.isRestRepository}}
    @RequestMapping(method= RequestMethod.{{target.restRepositoryInfo.method}}, path="/{{target.aggregate.namePlural}}")
    public void {{target.nameCamelCase}}(@RequestBody {{target.aggregate.namePascalCase}} {{target.aggregate.nameCamelCase}});
    {{/target.isRestRepository}}
    {{^target.isRestRepository}}
    @RequestMapping(method= RequestMethod.{{target.controllerInfo.method}}, path="/{{#setPath target}}{{/setPath}}")
    public void {{target.nameCamelCase}}(@PathVariable("id") {{target.aggregate.keyFieldDescriptor.className}} {{target.aggregate.keyFieldDescriptor.name}} {{#if (hasFields target.fieldDescriptors)}}, @RequestBody {{target.namePascalCase}}Command {{target.nameCamelCase}}Command {{/if}});
    {{/target.isRestRepository}}
}

<function>
 
    let isGetInvocation = ((this.source._type.endsWith("Command") || this.source._type.endsWith("Policy")) && this.target._type.endsWith("View"))
    let isPostInvocation = ((this.source._type.endsWith("Event") || this.source._type.endsWith("Policy")) && this.target._type.endsWith("Command"))
    let isExternalInvocation = (this.source.boundedContext.name != this.target.boundedContext.name)

    this.contexts.except = !(isExternalInvocation && isPostInvocation)

  window.$HandleBars.registerHelper('setPath', function (command) {
      if(command && command.controllerInfo && command.controllerInfo.apiPath){
          return command.aggregate.namePlural + '/{id}/' + command.controllerInfo.apiPath;
      }
          return command.aggregate.namePlural + '/{id}';

  })
  
  window.$HandleBars.registerHelper('hasFields', function (fieldDescriptors) {
    if(fieldDescriptors.length > 0) {
      return true;
    } else {
      return false;
    }
  });

  window.$HandleBars.registerHelper('log', function (aggregate) {
//      console.log("template log:", aggregate)
    return aggregate;
  })

  window.$HandleBars.registerHelper('wrap', function (exp) {
    return '{'+exp+'}';
  })

  window.$HandleBars.registerHelper('apiVariable', function (bc) {
    return '${api.url.'+bc+'}';
  })

</function>