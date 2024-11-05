forEach: Aggregate
representativeFor: Aggregate
fileName: {{namePascalCase}}.java
path: {{boundedContext.name}}/s20a01-domain/src/main/java/com/posco/{{boundedContext.name}}/s20a01/domain
---
package com.posco.{{boundedContext.name}}.s20a01.domain;

import javax.persistence.*;
import java.util.List;
import lombok.Data;
import java.util.Date;
import java.time.LocalDate;
{{#checkBigDecimal aggregateRoot.fieldDescriptors}}{{/checkBigDecimal}}

@Entity
@Table(name="{{namePascalCase}}_table")
@Data
{{#setDiscriminator aggregateRoot.entities.relations nameCamelCase}}{{/setDiscriminator}}
public class {{namePascalCase}} {{#checkExtends aggregateRoot.entities.relations namePascalCase}}{{/checkExtends}} {

    {{#aggregateRoot.fieldDescriptors}}
    {{^isVO}}{{#isKey}}
    @Id
    //{{#checkClassType ../aggregateRoot.fieldDescriptors}}{{/checkClassType}}
    {{/isKey}}{{/isVO}}
    {{#isLob}}@Lob{{/isLob}}
    {{#if (isPrimitive className)}}{{#isList}}{{/isList}}{{/if}}
    {{#checkFieldType className isVO isKey}}{{/checkFieldType}}
    private {{{className}}} {{nameCamelCase}};
    {{/aggregateRoot.fieldDescriptors}}

    {{#commands}}
    {{#if isRestRepository}}
    {{else}}
    public void {{nameCamelCase}}({{#fieldDescriptors}}{{^isKey}}{{{className}}} {{nameCamelCase}}{{^@last}}, {{/@last}}{{/isKey}}{{/fieldDescriptors}}){
        // 비즈니스 로직 구현
    }
    {{/if}}
    {{/commands}}

    {{#aggregateRoot.operations}}
    {{#setOperations ../commands name}}
    {{#isOverride}}
    @Override
    {{/isOverride}}
    {{^isRootMethod}}
    public {{returnType}} {{name}}(){
        // 비즈니스 로직 구현
        throw new UnsupportedOperationException("Not implemented");
    }
    {{/isRootMethod}}
    {{/setOperations}}
    {{/aggregateRoot.operations}}
}

<function>
window.$HandleBars.registerHelper('checkClassType', function (fieldDescriptors) {
    for(var i = 0; i < fieldDescriptors.length; i ++ ){
        if(fieldDescriptors[i] && fieldDescriptors[i].className == 'Long'){
            return "@GeneratedValue(strategy=GenerationType.AUTO)";
        }
    }
    return "";
});

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

// window.$HandleBars.registerHelper('checkAttribute', function (relations, source, target, isVO) {
//    try {
//        if(typeof relations === "undefined"){
//         return;
//         }

//         if(!isVO){
//             return;
//         }

//         var sourceObj = [];
//         var targetObj = [];
//         var sourceTmp = {};
//         var targetName = null;
//         for(var i = 0 ; i<relations.length; i++){
//             if(relations[i] != null){
//                 if(relations[i].sourceElement.name == source){
//                     sourceTmp = relations[i].sourceElement;
//                     sourceObj = relations[i].sourceElement.fieldDescriptors;
//                 }
//                 if(relations[i].targetElement.name == target){
//                     targetObj = relations[i].targetElement.fieldDescriptors;
//                     targetName = relations[i].targetElement.nameCamelCase;
//                 }
//             }
//         }

//         var samePascal = [];
//         var sameCamel = [];
//         for(var i = 0; i<sourceObj.length; i++){
//             for(var j =0; j<targetObj.length; j++){
//                 if(sourceObj[i].name == targetObj[j].name){
//                     samePascal.push(sourceObj[i].namePascalCase);
//                     sameCamel.push(sourceObj[i].nameCamelCase);
//                 }
//             }
//         }

//         var attributeOverrides = "";
//         for(var i =0; i<samePascal.length; i++){
//             var camel = sameCamel[i];
//             var pascal = samePascal[i];
//             var overrides = `@AttributeOverride(name="${camel}", column= @Column(name="${targetName}${pascal}", nullable=true))\n`;
//             attributeOverrides += overrides;
//         }

//         return attributeOverrides;
//     } catch (e) {
//        console.log(e)
//     }


// });

window.$HandleBars.registerHelper('isPrimitive', function (className) {
    if(className.includes("String") || className.includes("Integer") || className.includes("Long") || className.includes("Double") || className.includes("Float")
            || className.includes("Boolean") || className.includes("Date")){
        return true;
    } else {
        return false;
    }
});

window.$HandleBars.registerHelper('checkFieldType', function (className, isVO, isKey) {
    try {
        if (className==="Integer" || className==="String" || className==="Boolean" || className==="Float" || 
           className==="Double" || className==="Double" || className==="Long" || className==="Date"){
                return
        }else {
            if(className.includes("List")){
                return "@ElementCollection"
            }else{
                if(isVO == true){
                    if(isKey == true){
                        return "@EmbeddedId"
                    }else{
                        return "@Embedded"
                    }
                }else{
                    return "@Enumerated(EnumType.STRING)"
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
});

window.$HandleBars.registerHelper('checkExtends', function (relations, name) {
    try {
        if(typeof relations === "undefined" || name === "undefined"){
            return;
        } else {
            for(var i = 0; i < relations.length; i ++ ){
                if(relations[i] != null){
                    if(relations[i].sourceElement.name == name && relations[i].relationType.includes("Generalization")){
                        var text = "extends " + relations[i].targetElement.name
                        return text
                    }
                }
            }
        }
    } catch(e) {
        console.log(e)
    }
});

window.$HandleBars.registerHelper('setDiscriminator', function (relations, name) {
    try {
        if (typeof relations == "undefined") {
            return 
        } else {
            for (var i = 0; i < relations.length; i ++ ) {
                if (relations[i] != null) {
                    var text = ''
                    if (relations[i].targetElement != "undefined") {
                        if(relations[i].targetElement.name.toLowerCase() == name && relations[i].relationType.includes("Generalization")) {
                            text = '@DiscriminatorColumn(\n' + 
                                '    discriminatorType = DiscriminatorType.STRING,\n' +
                                '    name = "' + name + '_type",\n' +
                                '    columnDefinition = "CHAR(5)"\n' +
                                ')'
                            return text
                        }
                    } else {
                        if(relations[i].toName.toLowerCase() == name && relations[i].relationType.includes("Generalization")) {
                            text = '@DiscriminatorColumn(\n' + 
                                '    discriminatorType = DiscriminatorType.STRING,\n' +
                                '    name = "' + name + '_type",\n' +
                                '    columnDefinition = "CHAR(5)"\n' +
                                ')'
                            return text
                        }
                    }
                    if (relations[i].sourceElement != "undefined") {
                        if (relations[i].sourceElement.name.toLowerCase() == name && relations[i].relationType.includes("Generalization")) {
                            return '@DiscriminatorValue("' + name + '")'
                        }
                    } else {
                        if (relations[i].fromName.toLowerCase() == name && relations[i].relationType.includes("Generalization")) {
                            return '@DiscriminatorValue("' + name + '")'
                        }
                    }
                }
            }
        }
    } catch(e) {
        console.log(e)
    }
});

window.$HandleBars.registerHelper('setOperations', function (commands, name, options) {
    try {
        if(commands == "undefined") {
            return options.fn(this);
        }
        var isCmd = false;
        for (var i = 0; i < commands.length; i ++ ) {
            if(commands[i] != null) {
                if (commands[i].name == name && commands[i].isRestRepository != true) {
                    isCmd = true
                }
            }
        }
        if(isCmd) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    } catch(e) {
        console.log(e)
    }
});

window.$HandleBars.registerHelper('correlationGetSet', function (setter, getter,options) {
    let obj = {
        source: null,
        target: null
    };
   
    if(setter && setter.fieldDescriptors){
        obj.source = setter.fieldDescriptors.find(x=> x.isCorrelationKey);
    }
    if(getter && getter.fieldDescriptors){
        obj.target = getter.fieldDescriptors.find(x => x.isCorrelationKey);
    }
    
    return options.fn(obj);
});


window.$HandleBars.registerHelper('has', function (members) {
    try {
        return (members.length > 0);
    } catch(e) {
        console.log(e)
    }
});


</function>
