forEach: Aggregate
fileName: {{namePascalCase}}.js
path: common/js
---
{{#attached 'View' this}}
let rowData = [];
{{/attached}}
$(document).ready(function(){
    var OPT = {
        "Cfg": {
            "SearchMode": 2,
            "HeaderMerge": 3,
            "MessageWidth": 300,
        },
        "Def": {
            "Row": {
            "CanFormula": true
            }
        },
        Cols:[
            {{#aggregateRoot}}
            {{#fieldDescriptors}}
            {{#if isVO}}
            {{else}}
            {{#if isKey}}
            {"Header": "No", "Name": "No", "Type": "{{#checkFieldType className isVO namePascalCase}}{{/checkFieldType}}", "Align": "Center", "Width":140, "CanEdit":0},
            {{else}}
            {"Header": "{{#checkName nameCamelCase className}}{{/checkName}}", "Name": "{{nameCamelCase}}", "Type": "{{#checkFieldType className isVO namePascalCase}}{{/checkFieldType}}",{{#isDate className}}"Format": "yyyy-MM-dd", "EmptyValue": "날짜를 입력해주세요",{{/isDate}}{{#isEnum isVO className ../entities}} "Enum": {{/isEnum}}{{#checkEnum className isVO ../entities}}{{/checkEnum}}{{#isEnum isVO className ../entities}},{{/isEnum}}{{#isEnum isVO className ../entities}} "EnumKeys": {{/isEnum}}{{#checkEnum className isVO ../entities}}{{/checkEnum}}{{#isEnum isVO className ../entities}},{{/isEnum}} "Align": "Center", "Width":140, "CanEdit":1},  
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
        json.forEach(row => {
            row.No = row.{{#aggregateRoot.fieldDescriptors}}{{#if isKey}}{{nameCamelCase}}{{/if}}{{/aggregateRoot.fieldDescriptors}}
        {{#aggregateRoot}}
        {{#fieldDescriptors}}
        {{#if isVO}}
        {{#disassembleVO ../entities}}{{/disassembleVO}}
        {{/if}}
        {{/fieldDescriptors}}
        {{/aggregateRoot}}
        });
        rowData = json;
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
    rows.forEach(row => {
        rows.{{#aggregateRoot.fieldDescriptors}}{{#if isKey}}{{nameCamelCase}}{{/if}}{{/aggregateRoot.fieldDescriptors}} = rows.No
        delete rows.No
    {{#aggregateRoot}}
    {{#fieldDescriptors}}
    {{#if isVO}}
    {{#combineVO ../entities}}{{/combineVO}}
    {{/if}}
    {{/fieldDescriptors}}
    {{/aggregateRoot}}
    });
    rowData = rows;

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
{{#commands}}
{{^isRestRepository}}
function submit{{namePascalCase}}(data){
    {{#fieldDescriptors}}
    {{#if isKey}}
    const {{nameCamelCase}} = data.{{nameCamelCase}};
    {{/if}}
    {{/fieldDescriptors}}
    fetch(`http://localhost:8088/{{../namePlural}}/{{nameCamelCase}}/{{#fieldDescriptors}}{{#if isKey}}{{#addMustache nameCamelCase}}{{/addMustache}}{{/if}}{{/fieldDescriptors}}`, {
        method: '{{controllerInfo.method}}',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error);
    });
}           
{{/isRestRepository}}
{{/commands}}
{{#attached 'View' this}}
{{#isQuery dataProjection}}
function searchResult(params) {
    {{#if queryParameters}}
    const allEmpty = {{#queryParameters}}!params.{{nameCamelCase}} {{^@last}}&&{{/@last}}{{/queryParameters}};
    
    if (allEmpty) {
        alert("검색할 내용을 입력하세요.");
        return;
    }
    {{else}}
    if (params) {
        alert("검색할 내용을 입력하세요.");
        return;
    }
    {{/if}}
    const queryParams = new URLSearchParams(params).toString();

    $.ajax({
        url: `https://localhost:8088/{{aggregate.namePlural}}?${queryParams}`,
        method: 'GET',
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Content-Type": "application/json"
        },
        success: function(results) {
            if (results.length > 0) {
                sheet.loadSearchData(results);
            } else {
                alert("해당 조건에 대한 결과가 없습니다.");
            }
        },
        error: function(xhr, status, error) {
            console.error("에러", error);
            alert("데이터를 가져오는 중 오류가 발생했습니다.");
        }
    });
}
{{/isQuery}}
{{/attached}}
<function>
window.$HandleBars.registerHelper('isQuery', function (mode, options) {
    if(mode == 'query-for-aggregate'){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
});
window.$HandleBars.registerHelper('checkKeyField', function (type) {
    if(type === "String"){
        return "id";
    }else if(type === "Long" || type === "Integer" || type === "Double" || type === "BigDecimal" || type === "Float"){
        return "parseInt(id, 10)";
    }
});
window.$HandleBars.registerHelper('addMustache', function (name) {
    if(name){
        return `"${name}"`;
    }
});
window.$HandleBars.registerHelper('checkName', function (name, type) {
    if(type === "Boolean"){
        return {"Value": `"${name}"`,"HeaderCheck": 1}
    }else{
        return name;
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
                    var fieldName = fd.name;
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
                        voFieldType = `"Date", "Format": "yyyy-MM-dd", "EmptyValue": "날짜를 입력해주세요"`;
                    }else if(voField.className ==="Boolean"){
                        voFieldType = 'Bool';
                    }
                    result.push(`{"Header": ["${vo.namePascalCase}", "${voField.nameCamelCase}"], "Name": "${voField.nameCamelCase}", "Type": ${voFieldType}, "Width": 140}`);
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