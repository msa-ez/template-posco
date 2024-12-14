forEach: Aggregate
fileName: {{namePascalCase}}.js
path: common/js
---
let rowData = [];
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
            {"Header": "{{#checkName nameCamelCase className}}{{/checkName}}", "Name": "{{nameCamelCase}}", "Type": "{{#checkFieldType className isVO namePascalCase ../entities.relations}}{{/checkFieldType}}",{{#isDate className}}"Format": "yyyy-MM-dd", "EmptyValue": "날짜를 입력해주세요",{{/isDate}}{{#isEnum isVO namePascalCase ../entities}} "Enum": {{/isEnum}}{{#checkEnum namePascalCase isVO ../entities}}{{/checkEnum}}{{#isEnum isVO namePascalCase ../entities}},{{/isEnum}}{{#isEnum isVO namePascalCase ../entities}} "EnumKeys": {{/isEnum}}{{#checkEnum namePascalCase isVO ../entities}}{{/checkEnum}}{{#isEnum isVO namePascalCase ../entities}},{{/isEnum}} "Align": "Center", "Width":140, "CanEdit":1},  
            {{/if}}
            {{/if}}
            {{/fieldDescriptors}}
            {{/aggregateRoot}}
            {{#aggregateRoot}}
            {{#entities.relations}}
            {{#createVoField targetElement}}{{/createVoField}}
            {{/entities.relations}}
            {{/aggregateRoot}}
        ],
        Events: {
            onClick: function(evtParam) {
                var originalRowData = rowData.find(item => item.No === evtParam.row.No);
                var detailData = [];
                {{#aggregateRoot.fieldDescriptors}}
                {{#if isList}}
                if (evtParam.col === "{{nameCamelCase}}") {
                    var {{nameCamelCase}}Fields = originalRowData.{{nameCamelCase}};
                    if (Array.isArray({{nameCamelCase}}Fields)) {
                        {{nameCamelCase}}Fields.forEach(function(data) {
                            detailData.push({ "{{nameCamelCase}}": data });
                        });
                    } else {
                        detailData.push({ "{{nameCamelCase}}": {{nameCamelCase}}Fields });
                    }
                }
                {{/if}}
                {{/aggregateRoot.fieldDescriptors}}
        
                detailSheet.loadSearchData(detailData);
            }
        }
    };
    
    var detailSheetOptions = {
        "Cfg": {
            "SearchMode": 2,
            "HeaderMerge": 3,
            "MessageWidth": 300,
        },
        Cols:[
            {{#aggregateRoot.fieldDescriptors}}
            {{#if isList}}
            {"Header": "{{nameCamelCase}}", "Name": "{{nameCamelCase}}", "Type": "Text", "Align": "Center", "Width":140, "CanEdit":0},
            {{/if}}
            {{/aggregateRoot.fieldDescriptors}}
        ]
    };

    IBSheet.create({
       id:"sheet",
       el:"sheet_DIV",
       options: OPT
    });
    
    IBSheet.create({
        id:"detailSheet",
        el:"detailSheet_DIV",
        options: detailSheetOptions
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
        for(var i = 0; i < json.length; i++){
            json[i].No = json[i].{{#aggregateRoot.fieldDescriptors}}{{#if isKey}}{{nameCamelCase}}{{/if}}{{/aggregateRoot.fieldDescriptors}}
            {{#aggregateRoot}}
            {{#fieldDescriptors}}
            {{#if isVO}}
            {{#disassembleVO ../entities}}{{/disassembleVO}}
            {{/if}}
            {{/fieldDescriptors}}
            {{/aggregateRoot}}

            {{#aggregateRoot.fieldDescriptors}}
            {{#checkDateType nameCamelCase className}}
            {{/checkDateType}}
            {{/aggregateRoot.fieldDescriptors}}
        }
        
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

function save(data){
    var rows = data;
    rows.id = rows.No
    delete rows.No

    $.ajax({
        url: "/{{namePlural}}",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(rows)
    });
    retrieve();

}

function saveRow(){
    var rows = sheet.getSaveJson()?.data;
    for(var i = 0; i < rows.length; i++){
        rows[i].{{#aggregateRoot.fieldDescriptors}}{{#if isKey}}{{nameCamelCase}}{{/if}}{{/aggregateRoot.fieldDescriptors}} = rows[i].No
        delete rows[i].No

        {{#aggregateRoot}}
        {{#fieldDescriptors}}
        {{#if isVO}}
        {{#combineVO ../entities}}{{/combineVO}}
        {{/if}}
        {{/fieldDescriptors}}
        {{/aggregateRoot}}
    }
    
    rowData = rows;

    for(var i=0; i<rows.length;i++){
        switch(rows[i].STATUS){
            case "Changed":
                var rowObj = sheet.getRowById(rows[i].id);
                var changedData = JSON.parse(sheet.getChangedData(rowObj))["Changes"][0];
                changedData.id = rows[i].{{#aggregateRoot.fieldDescriptors}}{{#if isKey}}{{nameCamelCase}}{{/if}}{{/aggregateRoot.fieldDescriptors}}
                var id = changedData.id 
                $.ajax({
                    url: `/{{namePlural}}/${id}`,
                    method: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(changedData)
                });
                break;
            case "Deleted":
                var id = rows[i].{{#aggregateRoot.fieldDescriptors}}{{#if isKey}}{{nameCamelCase}}{{/if}}{{/aggregateRoot.fieldDescriptors}}
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
    const id = data.{{nameCamelCase}};
    {{/if}}
    {{/fieldDescriptors}}
    fetch(`/{{../namePlural}}/{{nameCamelCase}}/${id}`, {
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
        url: `/{{aggregate.namePlural}}?${queryParams}`,
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
window.$HandleBars.registerHelper('checkDateType', function (type, name) {
    if(type === "Date"){
        return `json[i].${name} = json[i].name.split('T')[0];`;
    }
});
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
window.$HandleBars.registerHelper('canVO', function (vo, options) {
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
                    conditions.push(`rows[i].${fieldName}`);
                    assignments.push(`${fieldName}: rows[i].${fieldName}`);
                    deletions.push(`delete rows[i].${fieldName}`);
                });

                result.push(`
                if (${conditions.join(' && ')}) {
                    rows[i].${vo.name} = {
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
                    if(fd.className === "Date"){
                        assignments.push(`json[i].${fieldName} = json[i].${vo.name}.${fieldName}.split('T')[0]`);
                    }else{
                        assignments.push(`json[i].${fieldName} = json[i].${vo.name}.${fieldName}`);
                    }
                });

                result.push(`
                if (json[i].${vo.name}) {
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
window.$HandleBars.registerHelper('isEnum', function (voField, fieldName, field, options) {
    if(voField){
        return options.inverse(this);
    }else{
        var relation = field.relations
        if(relation){
            for(var i = 0; i < relation.length; i++){
                if(relation[i] && relation[i].name){
                    var name = '';
                    name = relation[i].name.charAt(0).toUpperCase() + relation[i].name.slice(1);
                    if(name == fieldName){
                        return options.fn(this);
                            
                    }else{
                        return
                    }
                }
            }
        }
    }
});
window.$HandleBars.registerHelper('checkEnum', function (fieldName, voField, field) {
    if(voField){
        return;
    }else{
        var relation = field.relations
        if(relation){
            for(var i = 0; i < relation.length; i++){
                if(relation[i] && relation[i].name){
                    var name = '';
                    name = relation[i].name.charAt(0).toUpperCase() + relation[i].name.slice(1);
                    if(fieldName === name){
                        if(relation[i].targetElement && relation[i].targetElement.items){
                            var items = relation[i].targetElement.items;
                            if(items){
                                var result = items.map(item => item.value).join('|');
                                return `"|${result}"`;
                            }
                        }
                    }
                }else{
                    return;
                }
            }
        }
    }
});
window.$HandleBars.registerHelper('createVoField', function (relationField) {
    var result = [];
    for(var i = 0; i < relationField.length; i++){
        if(relationField[i].targetElement && relationField[i].targetElement.isVO){
            for(var j = 0; j < relationField[i].targetElement.fieldDescriptors.length; j++){
                var voField = relationField[i].targetElement.fieldDescriptors[j];
                var voFieldType = '';
                if(voField.className === "String"){
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
                result.push(`{"Header": ["${relationField[i].targetElement.namePascalCase}", "${voField.nameCamelCase}"], "Name": "${voField.nameCamelCase}", "Type": ${voFieldType}, "Width": 140, "CanEdit": 1},`);
            }
        }
    }
    return result.join('\n'); 
});

window.$HandleBars.registerHelper('checkFieldType', function (type, voField, fieldName, enumField) {
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
    }else{
        if (enumField) {
            let result;
            for (let field of enumField) {
                if (type === field.targetElement.namePascalCase && 
                    field.targetElement._type.endsWith("enum")) {
                    result = "Enum";
                    break; 
                }
            }
            return result;
        }
    }
});
</function>