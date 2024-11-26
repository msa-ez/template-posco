forEach: Aggregate
fileName: {{namePascalCase}}.js
path: common/js
---
$(document).ready(function(){
    var OPT = {
        Cols:[
            {{#aggregateRoot}}
            {{#fieldDescriptors}}
            { "Header": "{{#checkName displayName namePascalCase className}}{{/checkName}}", "Name": "{{nameCamelCase}}", "Type": "{{#checkFieldType className isVo namePascalCase}}{{/checkFieldType}}",{{#isDate className}} "EmptyValue": "날짜를 입력해주세요",{{/isDate}}{{#isEnum className ../entities}} "Enum": {{/isEnum}}{{#checkEnum className ../entities}}{{/checkEnum}}{{#isEnum className ../entities}},{{/isEnum}}{{#isEnum className ../entities}} "EnumKeys": {{/isEnum}}{{#checkEnum className ../entities}}{{/checkEnum}}{{#isEnum className ../entities}},{{/isEnum}} "Width":120, "CanEdit":1},
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
window.$HandleBars.registerHelper('addMustache', function (id) {
    var result = '';
    result = "{" + id + "}"
    return result;
});
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
window.$HandleBars.registerHelper('checkFieldType', function (type, vo, fieldName) {
    if(type === "String"){
        return 'Text';
    }else if(type === "Long" || type === "Integer" || type === "Double" || type === "BigDecimal"){
        return 'Int';
    }else if(type === "Float"){
        return 'Float';
    }else if(type === "Date"){
        return 'Date';
    }else if(type === "Boolean"){
        return 'Bool';
    }else if(!vo && (type == fieldName)){
        return 'Enum';
    }else if(vo){
        return
    }
});
window.$HandleBars.registerHelper('isDate', function (type, options) {
    if(type === "Date"){
        return options.fn(this);
    }
    return options.inverse(this);
});
window.$HandleBars.registerHelper('isEnum', function (type, field, options) {
    var relation = field.relations
    for(var i = 0; i < relation.length; i++){
        if(type == relation[i].targetElement.name){
            return options.fn(this);
        }
    }
    return options.inverse(this);
});
window.$HandleBars.registerHelper('checkEnum', function (type, field) {
    var relation = field.relations
    for(var i = 0; i < relation.length; i++){
        if(type == relation[i].targetElement.name){
            var items = relation[i].targetElement.items;
            var result = items.map(item => item.value).join('|');
            return `"|${result}"`;
        }
    }
});
</function>