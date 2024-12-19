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
            {{#checkDefaultType className}}
            {"Header": {{#checkName nameCamelCase className}}{{/checkName}}, "Name": "{{nameCamelCase}}", "Type": "{{#checkFieldType className isVO namePascalCase ../entities.relations}}{{/checkFieldType}}",{{#isDate className}}"Format": "yyyy-MM-dd", "EmptyValue": "날짜를 입력해주세요",{{/isDate}} "Align": "Center", "Width":140, "CanEdit":1},  
            {{/checkDefaultType}}
            {{/if}}
            {{/if}}
            {{/fieldDescriptors}}
            {{/aggregateRoot}}
            {{#aggregateRoot}}
            {{#entities.relations}}
            {{#if targetElement.fieldDescriptors}}
            {{#targetElement.fieldDescriptors}}
            {"Header": ["{{../targetElement.nameCamelCase}}", "{{nameCamelCase}}"], "Name": "{{nameCamelCase}}", {{#checkVOFieldType className}}{{/checkVOFieldType}}{{#isInternalEnum className ../../entities.relations}}{{/isInternalEnum}} "Width": 140, "CanEdit": 1},
            {{/targetElement.fieldDescriptors}}
            {{/if}}
            {{#if targetElement.items}}
            {"Header": "{{targetElement.nameCamelCase}}", "Name": "{{targetElement.nameCamelCase}}", "Type": "Enum", "Enum": "{{#targetElement.items}}|{{value}}{{/targetElement.items}}", "EnumKeys": "{{#targetElement.items}}|{{value}}{{/targetElement.items}}", "Align": "Center", "Width":140, "CanEdit":0},
            {{/if}}
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
            {{#aggregateRoot.entities.relations}}
            {{#if targetElement.isVO}}
            {{#disassembleVO this}}{{/disassembleVO}}
            {{/if}}
            {{/aggregateRoot.entities.relations}}

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

    $.ajax({
        url: "/{{namePlural}}",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(rows),
        success: function() {
            retrieve();
        }
    });
    

}

function saveRow(){
    var rows = sheet.getSaveJson()?.data;
    for(var i = 0; i < rows.length; i++){
        rows[i].{{#aggregateRoot.fieldDescriptors}}{{#if isKey}}{{nameCamelCase}}{{/if}}{{/aggregateRoot.fieldDescriptors}} = rows[i].No
        delete rows[i].No

        {{#aggregateRoot.entities.relations}}
        {{#if targetElement.isVO}}
        {{#combineVO this}}{{/combineVO}}
        {{/if}}
        {{/aggregateRoot.entities.relations}}
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
function searchMultiple(data, path) {
    // Convert data object to query parameters
    const queryParams = new URLSearchParams();
    
    function flattenObject(obj, prefix = '') {
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                flattenObject(value, newKey);
            } else {
                queryParams.append(newKey, value);
            }
        });
    }
    
    flattenObject(data);
    
    fetch(`/{{namePlural}}/${path}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        if (data) {
            sheet.loadSearchData([data]);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('데이터 조회 중 오류가 발생했습니다: ' + error.message);
    });
}

<function>
window.$HandleBars.registerHelper('isQueryMultiple', function (mode, options) {
    if(mode == 'query-for-multiple-aggregate'){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
});

window.$HandleBars.registerHelper('checkDefaultType', function (type, options) {
    if(type === "String" || type === "Long" || type === "Integer" || type === "Double" || type === "BigDecimal" || type === "Float" || type === "Date" || type === "Boolean"){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
});
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
        return `{"Value": "${name}", "HeaderCheck": 1}`;
    }else{
        return `"${name}"`;
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
    var relation = voField

    if(relation && relation.targetElement){
        if(relation.targetElement.isVO){
            var vo = relation.targetElement;
            if(vo && vo.fieldDescriptors){
                var conditions = [];
                var assignments = [];
                var deletions = [];
                vo.fieldDescriptors.forEach(fd => {
                    var fieldName = fd.nameCamelCase; // 필드 이름을 가져옴
                    conditions.push(`rows[i].${fieldName}`);
                    assignments.push(`${fieldName}: rows[i].${fieldName}`);
                    deletions.push(`delete rows[i].${fieldName}`);
                });

                result.push(`
                if (${conditions.join(' && ')}) {
                    rows[i].${vo.nameCamelCase} = {
                        ${assignments.join(',\n')}
                    };
                    ${deletions.join(';\n')}
                }
                `);
            } 
        }
    }
    return new window.$HandleBars.SafeString(result.join('\n'));
});
window.$HandleBars.registerHelper('isEnum', function (type, enumField, options) {
    if(type && enumField){
        for(let field of enumField){
            if(field && field.targetElement && field.targetElement.namePascalCase){
                if(type == field.targetElement.namePascalCase && field.targetElement._type.endsWith('enum')){
                    return options.fn(this); // 조건이 만족되면 즉시 결과 반환
                }
            }
        }
    }
    return options.inverse(this); // 조건이 만족되지 않으면 inverse 반환
});
window.$HandleBars.registerHelper('disassembleVO', function (voField) {
    var result = [];
    var relation = voField
    if(relation && relation.targetElement){
        if(relation.targetElement.isVO){
            var vo = relation.targetElement;
            if(vo && vo.fieldDescriptors){
                var assignments = [];
                vo.fieldDescriptors.forEach(fd => {
                    var fieldName = fd.nameCamelCase;
                    if(fd.className === "Date"){
                        assignments.push(`json[i].${fieldName} = json[i].${vo.nameCamelCase}.${fieldName}.split('T')[0]`);
                    }else{
                        assignments.push(`json[i].${fieldName} = json[i].${vo.nameCamelCase}.${fieldName}`);
                    }
                });

                result.push(`
                if (json[i].${vo.nameCamelCase}) {
                    ${assignments.join(';\n')}
                }
                `);
            }
        }
    }
    return new window.$HandleBars.SafeString(result.join('\n'));
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
window.$HandleBars.registerHelper('createVoField', function (relationField, enumField) {
    var result = [];
    var quote = "'";
    if(relationField.isVO){
        var vo = relationField.namePascalCase;
        for(var i = 0; i < relationField.fieldDescriptors.length; i++){
            var voField = relationField.fieldDescriptors[i];
            var voFieldType = '';
            if(voField.className === "String"){
                voFieldType = quote + 'Text' + quote;
            }else if(voField.className ==="Long" || voField.className ==="Integer" || voField.className ==="Double" || voField.className ==="BigDecimal"){
                voFieldType = quote + 'Int' + quote;
            }else if(voField.className ==="Float"){
                voFieldType = quote + 'Float' + quote;
            }else if(voField.className ==="Date"){
                voFieldType = `"Date", "Format": "yyyy-MM-dd", "EmptyValue": "날짜를 입력해주세요"`;
            }else if(voField.className ==="Boolean"){
                voFieldType = quote + 'Bool' + quote;
            }else if(voField.className !== "String" && voField.className !== "Long" && voField.className !== "Integer" && voField.className !== "Double" && voField.className !== "BigDecimal" && voField.className !== "Float" && voField.className !== "Date" && voField.className !== "Boolean"){
                var matchEnum = enumField.find(ef => ef.targetElement.namePascalCase === voField.className);
                if(matchEnum && matchEnum.targetElement.items) {
                    var enumValues = matchEnum.targetElement.items.map(item => item.value).join('|');
                    voFieldType = `"Enum", "Enum": "${enumValues}", "EnumKeys": "${enumValues}"`;
                }
            }
            result.push(`{"Header": ["${vo}", "${voField.nameCamelCase}"], "Name": "${voField.nameCamelCase}", "Type": ${voFieldType}, "Width": 140, "CanEdit": 1},`);
        }
    }
    return result.join('\n'); 
});

window.$HandleBars.registerHelper('checkVOFieldType', function (type) {
    if(type === 'String'){
        return '"Type": "Text",';
    }else if(type === "Long" || type === "Integer" || type === "Double" || type === "BigDecimal"){
        return '"Type": "Int",';
    }else if(type === "Float"){
        return '"Type": "Float",';
    }else if(type === "Date"){
        return '"Type": "Date",';
    }else if(type === "Boolean"){
        return '"Type": "Bool",';
    }else{
        return;
    }
});

window.$HandleBars.registerHelper('isInternalEnum', function (type, enumField) {
    if(type !== "String" && type !== "Long" && type !== "Integer" && type !== "Double" && type !== "BigDecimal" && type !== "Float" && type !== "Date" && type !== "Boolean"){
        for(var i = 0; i < enumField.length; i++){
            if(enumField[i] && enumField[i].targetElement){
                if(enumField[i].targetElement.namePascalCase){
                    if(type === enumField[i].targetElement.namePascalCase && enumField[i].targetElement._type.endsWith("enum")){
                        if(enumField[i].targetElement.items){
                            var items = enumField[i].targetElement.items;
                            if(items){
                                var result = items.map(item => item.value).join('|');
                                result = '|' + result;
                                return `"Type": "Enum", "Enum": "${result}", "EnumKeys": "${result}",`;
                            }else{
                                return;
                            }
                        }else{
                            return;
                        }
                    }else{
                        return;
                    }
                }else{
                    return;
                }
            }else{
                return;
            }
        }
    }else{
        return;
    }
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
                if(field.targetElement && field.targetElement.namePascalCase){
                    if (type === field.targetElement.namePascalCase && field.targetElement._type.endsWith("enum")) {
                        result = "Enum";
                        break; 
                    }else{
                        return;
                    }
                }else{
                    return;
                }
            }
            return result;
        }
    }
});
</function>
