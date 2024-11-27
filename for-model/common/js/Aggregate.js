forEach: Aggregate
fileName: {{namePascalCase}}.js
path: common/js
---
$(document).ready(function(){
    var OPT = {
        {{#aggregateRoot.keyFieldDescriptor}}
        "LeftCols": [
            {"Header": "{{#checkName displayName namePascalCase className}}{{/checkName}}","Type": "{{#checkFieldType className isVO namePascalCase}}{{/checkFieldType}}","Width": 50,"Align": "Center","Name": "{{nameCamelCase}}"}
        ],
        {{/aggregateRoot.keyFieldDescriptor}}
        Cols:[
            {{#aggregateRoot}}
            {{#fieldDescriptors}}
            {{#if isVO}}
            {{else}}
            {{#if isKey}}
            {{else}}
            {"Header": "{{#checkName displayName namePascalCase className}}{{/checkName}}", "Name": "{{nameCamelCase}}", "Type": "{{#checkFieldType className isVO namePascalCase}}{{/checkFieldType}}",{{#isDate className}}"Format": "yyyy-MM-dd", "EmptyValue": "날짜를 입력해주세요",{{/isDate}}{{#isEnum isVO className ../entities}} "Enum": {{/isEnum}}{{#checkEnum className isVO ../entities}}{{/checkEnum}}{{#isEnum isVO className ../entities}},{{/isEnum}}{{#isEnum isVO className ../entities}} "EnumKeys": {{/isEnum}}{{#checkEnum className isVO ../entities}}{{/checkEnum}}{{#isEnum isVO className ../entities}},{{/isEnum}} "Align": "Center", "Width":120, "CanEdit":1},  
            {{/if}}
            {{/if}}
            {{/fieldDescriptors}}
            {{/aggregateRoot}}
            {{#aggregateRoot}}
            {{#fieldDescriptors}}
            {{#if isVO}}
            {{#createVoField className ../entities}}{{/createVoField}}
            {{/if}}
            {{/fieldDescriptors}}
            {{/aggregateRoot}}
       ]
   };

   IBSheet.create({
       id:"sheet",
       el:"sheet_DIV",
       options:OPT
   });
});

function retrieve(){
    fetch("/{{namePlural}}", {
        method: 'GET',
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Content-Type": "application/json"
        }
    }).then(res => {
        return res.json();
    }).then(json => {
        {{#aggregateRoot}}
        {{#fieldDescriptors}}
        {{#if isVO}}
        {{#isVO isVO}}json.forEach(row => {
        {{/isVO}}
            {{#disassembleVO ../entities}}{{/disassembleVO}}
        {{#isVO isVO}}
        });{{/isVO}}
        {{/if}}
        {{/fieldDescriptors}}
        {{/aggregateRoot}}
        sheet.loadSearchData(json)
    }).catch(error => {
        console.error("에러", error);
    });
}

function addData(){
   sheet.addRow();
}

function deleteData(){
    sheet.deleteRow(sheet.getFocusedRow());
}

function save(){
    var rows = sheet.getSaveJson()?.data;

    {{#aggregateRoot}}
    {{#fieldDescriptors}}
    {{#if isVO}}
    {{#isVO isVO}}rows.forEach(row => {
    {{/isVO}}
        {{#combineVO ../entities}}{{/combineVO}}
    {{#isVO isVO}}
    });{{/isVO}}
    {{/if}}
    {{/fieldDescriptors}}
    {{/aggregateRoot}}

    for(var i=0; i<rows.length;i++){
        if(rows[i].id.includes("AR")){
            rows[i].id = rows[i].id.replace(/AR/g, "");
        }
        switch(rows[i].STATUS){
            case "Added":
                var saveRow = rows[i];
                $.ajax({
                    url: "/{{namePlural}}",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(saveRow)
                });
                break;
            case "Changed":
                var rowObj = sheet.getRowById(rows[i].id);
                var changedData = JSON.parse(sheet.getChangedData(rowObj))["Changes"][0];
                var id = rows[i].seq;
                $.ajax({
                    url: `/{{namePlural}}/${id}`,
                    method: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(changedData)
                });
                break;
            case "Deleted":
                var id = rows[i].seq;
                $.ajax({
                    url: `/{{namePlural}}/${id}`,
                    method: "DELETE",
                });
                break;
        }     
    }           
}
<function>
window.$HandleBars.registerHelper('checkName', function (koName, engName, type) {
    if(type === "Boolean"){
        if(koName){
            return {"Value": `"${koName}"`,"HeaderCheck": 1}
        }else{
            return {"Value": `"${engName}"`,"HeaderCheck": 1}
        }
    }else{
        if(koName){
            return koName;
        }else{
            return engName;
        }
    }
});
window.$HandleBars.registerHelper('isDate', function (type, options) {
    if(type === "Date"){
        return options.fn(this);
    }
    return options.inverse(this);
});
window.$HandleBars.registerHelper('isVO', function (vo, options) {
    if(vo){
        return options.fn(this);
    }
    return options.inverse(this);
});
window.$HandleBars.registerHelper('combineVO', function (voField) {
    var result = [];
    var relation = voField.relations

    for(var i = 0; i < relation.length; i++){
        if(relation[i].targetElement && relation[i].targetElement.isVO){
            var vo = relation[i].targetElement;
            if(vo && vo.fieldDescriptors){
                var conditions = [];
                var assignments = [];
                var deletions = [];
                vo.fieldDescriptors.forEach(fd => {
                    var fieldName = fd.name; // 필드 이름을 가져옴
                    conditions.push(`row.${fieldName}`);
                    assignments.push(`${fieldName}: row.${fieldName}`);
                    deletions.push(`delete row.${fieldName}`);
                });

                result.push(`
                    if (${conditions.join(' && ')}) {
                        row.${vo.name} = {
                            ${assignments.join(',\n')}
                        };
                        ${deletions.join(';\n')}
                    }
                `);
            }else{
                return;
            }
        }
    }
    return new window.$HandleBars.SafeString(result.join('\n'));
});
window.$HandleBars.registerHelper('disassembleVO', function (voField) {
    var result = [];
    var relation = voField.relations

    for(var i = 0; i < relation.length; i++){
        if(relation[i].targetElement && relation[i].targetElement.isVO){
            var vo = relation[i].targetElement;
            if(vo && vo.fieldDescriptors){
                var assignments = [];
                vo.fieldDescriptors.forEach(fd => {
                    var fieldName = fd.name; // 필드 이름을 가져옴
                    assignments.push(`row.${fieldName} = row.${vo.name}.${fieldName}`);
                });

                result.push(`
                    if (row.${vo.name}) {
                        ${assignments.join(';\n')}
                    }
                `);
            }else{
                return;
            }
        }
    }
    return new window.$HandleBars.SafeString(result.join('\n'));
});
window.$HandleBars.registerHelper('isEnum', function (voField, type, field, options) {
    if(voField){
        return options.inverse(this);
    }else{
        var relation = field.relations
        if(relation){
            for(var i = 0; i < relation.length; i++){
                if(relation[i].targetElement){
                    if(relation[i].targetElement.name){
                        if(type === relation[i].targetElement.name){
                            return options.fn(this);
                            
                        }
                    }
                }
            }
        }
    }
});
window.$HandleBars.registerHelper('checkEnum', function (type, voField, field) {
    if(voField){
        return;
    }else{
        var relation = field.relations
        for(var i = 0; i < relation.length; i++){
            if(relation[i].targetElement && relation[i].targetElement.name){
                if(type === relation[i].targetElement.name){
                    var items = relation[i].targetElement.items;
                    if(items){
                        var result = items.map(item => item.value).join('|');
                        return `"|${result}"`;
                    }
                }
            }
        }
    }
});
window.$HandleBars.registerHelper('addMustache', function (id) {
    var result = '';
    result = "{" + id + "}"
    return result;
});
window.$HandleBars.registerHelper('createVoField', function (type, field) {
    var result = [];
    var relation = field.relations

    for(var i = 0; i < relation.length; i++){
        if(relation[i].targetElement && relation[i].targetElement.isVO){
            var vo = relation[i].targetElement;
            if(vo && vo.fieldDescriptors){
                for(var j = 0; j < vo.fieldDescriptors.length; j++){
                    var voField = vo.fieldDescriptors[j];
                    var voFieldType = '';
                    if(voField.className ==="String"){
                        voFieldType = 'Text';
                    }else if(voField.className ==="Long" || voField.className ==="Integer" || voField.className ==="Double" || voField.className ==="BigDecimal"){
                        voFieldType = 'Int';
                    }else if(voField.className ==="Float"){
                        voFieldType = 'Float';
                    }else if(voField.className ==="Date"){
                        voFieldType = 'Date';
                    }else if(voField.className ==="Boolean"){
                        voFieldType = 'Bool';
                    }
                    result.push(`{"Header": ["${vo.namePascalCase}", "${voField.nameCamelCase}"], "Name": "${voField.nameCamelCase}", "Type": "${voFieldType}", "Width": 110}`);
                }
            }else{
                return;
            }
        }
    }
    return result.join(',\n'); 
});
window.$HandleBars.registerHelper('checkFieldType', function (type, voField, fieldName) {
    if(type === 'String'){
        return "Text";
    }else if(type === "Long" || type === "Integer" || type === "Double" || type === "BigDecimal"){
        return "Int";
    }else if(type === "Float"){
        return "Float";
    }else if(type === "Date"){
        return "Date";
    }else if(type === "Boolean"){
        return "Bool";
    }else if(type == fieldName){
        if(voField){
            return;
        }else{
            return "Enum";
        }
    }
});
</function>