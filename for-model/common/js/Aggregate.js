forEach: Aggregate
fileName: {{namePascalCase}}.js
path: common/js
---
$(document).ready(function(){

    var IB_Preset = {
        "YMD":{Type:"Date",Align:"Center","Format": "yyyy/MM/dd", "DataFormat": "yyyyMMdd", "EditFormat": "yyyyMMdd", Size:8,EditMask:"^\d*$",EmptyValue:"<span style='color:#AAA'>년,월,일 순으로 숫자만 입력해 주세요.</span>"},
      };
    var OPT = {
        "Cols": [
    {"Type": "Text","Name": "TextData","Width": 100,"Align": "Center","CanEdit": 1},
    {"Header": "줄넘김문자열(Lines)","Type": "Lines","Name": "LinesData","MinWidth": 250,"Align": "Center","CanEdit": 1,"RelWidth": 1},
    {"Type": "Enum","Name": "ComboData","Align": "Center","Enum": "|대기|진행중|완료","EnumKeys": "|01|02|03"},
    {"Header": "버튼(Button)","Type": "Button","Name": "ISO","Width": 80,"Align": "Left","CanEdit": 0,"Button": "Button"},
    {"Header": "정수(Int)","Type": "Int","Name": "IntData","Width": 80,"Align": "Right","CanEdit": 1},
    {"Header": "실수(Float)","Type": "Float","Name": "FloatData","Format": "#,##0.0#","Width": 80,"Align": "Right","CanEdit": 1},
    {"Header": "날짜(Date)","Type": "Date","Name": "DateData","Width": 150,"Align": "Center","CanEdit": 1,"EmptyValue": "날짜를 입력해주세요"},
    {"Header": "앵커(Link)","Type": "Link","Name": "LinkData","TextStyle": 4,"TextColor": "#0000FF","Width": 60,"CanEdit": 0},
    {"Header": "이미지(Img)","Type": "Img","Name": "ImageData","Width": 70,"Align": "Center","CanEdit": 1},
    {"Header": "패스워드(Pass)","Type": "Pass","Name": "PassData","Width": 80,"Align": "Left","CanEdit": 1},
    {"Header": "라디오(Radio)","Type": "Radio","Name": "RadioData","Width": 140,"Align": "Center","CanEdit": 1,"Enum": "|상|중|하","EnumKeys": "|H:1|M:1|L:1"},
    {"Header": {"Value": "체크박스(Bool)","HeaderCheck": 1},"Type": "Bool","Name": "CheckData","Width": 110,"Align": "Center","CanEdit": 1}
  ]
        Cols:[
            {{#aggregateRoot}}
            {{#fieldDescriptors}}
            { "Header": "{{#if displayName}}{{else}}{{namePascalCase}}{{/if}}", "Name": "{{nameCamelCase}}", "Type": "{{#checkFieldType className isVo namePascalCase}}{{/checkFieldType}}", "{{#checkEnum className ../entities}}{{/checkEnum}}" "Width":120, "CanEdit":1},
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
window.$HandleBars.registerHelper('checkFieldType', function (type, vo, fieldName) {
    if(type === "String"){
        return Text;
    }else if(type === "Long" || type === "Integer" || type === "Double" || type === "BigDecimal"){
        return Int;
    }else if(type === "Float"){
        return Float;
    }else if(type === "Date"){
        return Date;
    }else if(type === "Boolean"){
        return Bool;
    }else if(!vo && (type == fieldName)){
        return Enum;
    }
});
window.$HandleBars.registerHelper('checkEnum', function (type, enum) {
    var relation = enum.relations
    for(var i = 0; i < relation.length; i++){
        if(type == relation[i].targetElement.name){
            var items = relation[i].targetElement.items;
            var result = items.map(item => item.value).join('|');
            return result;
        }
    }
});
</function>