forEach: Enumeration
fileName: {{pascalCase name}}.java
path: {{boundedContext.name}}/{{option.package}}-domain/src/main/java/com/posco/{{boundedContext.name}}/{{option.package}}/domain
mergeType: template
---
package com.posco.{{boundedContext.name}}.{{option.package}}.domain;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import java.util.List;
import lombok.Data;
import java.util.Date;


public enum {{pascalCase name}} {

    {{#items}}
    {{#setItems value ../items}}{{/setItems}}
    {{/items}}

}

<function>

window.$HandleBars.registerHelper('setItems', function (value, items) {
    try {
        var text = ''
        for(var i = 0; i < items.length; i ++ ){
            if(items[i]) {
                if(items[i].value == value) {
                    text = value
                    if(i+1 < items.length) {
                        text += ','
                    } else {
                        text += ';'
                    }
                    return text
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
});

</function>