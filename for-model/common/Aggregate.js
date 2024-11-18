forEach: Aggregate
fileName: {{namePascalCase}}.html
path: static/ibsheet
---
$(document).ready(function(){
    var OPT = {
        Cols:[
            {{#aggregateRoot.fieldDescriptors}} 
            { Header: "{{displayName}}", Name: "{{nameCamelCase}}", Type: "Text", Width:80, RelWidth:1},
            {{/aggregateRoot.fieldDescriptors}}
       ]
   };

   IBSheet.create({
       id:"sheet",
       el:"sheet_DIV",
       options:OPT
   });
});

function retrieve(){
    fetch("http://internal-k8s-ftl-ingress1-eafee7ab24-1743142653.ap-northeast-2.elb.amazonaws.com/l9a990-sample{{namePlural}}/{{namePlural}}/all", {
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
        switch(rows[i].STATUS){
            case "Added":
                var saveRow = rows[i];
                saveRow["createdObjectType"] =  "C";
                saveRow["createdObjectId"] =  "L9A01001";
                saveRow["createdProgramId"] =  "L9A01001";
                saveRow["creationTimestamp"] =  1643330024000;
                saveRow["lastUpdatedObjectType"] =  "C";
                saveRow["lastUpdatedObjectId"] =  "L9A01001";
                saveRow["lastUpdateProgramId"] =  "L9A01001";
                saveRow["lastUpdateTimestamp"] =  1643330024000;
                $.ajax({
                    url:"http://ap-northeast-2.elb.amazonaws.com/l9a990-sample{{namePlural}}/{{namePlural}}",
                    method:"POST",
                    contentType :"application/json",
                    data:JSON.stringify(saveRow)
                });
                break;
            case "Changed":
                var rowObj = sheet.getRowById(rows[i].id);
                var changedData = JSON.parse(sheet.getChangedData(rowObj))["Changes"][0];
                var nameValueData = {};
                var saveArr = Object.keys(changedData).map((key,idx)=>{
                    return {"name":key , "value": changedData[key]}
                })
                nameValueData["nameValues"] = saveArr;
                var id = rows[i].seq;
                $.ajax({
                    url:`http://ap-northeast-2.elb.amazonaws.com/l9a990-sample{{namePlural}}/{{namePlural}}/${id}`,
                    method:"PUT",
                    contentType :"application/json",
                    data:JSON.stringify(nameValueData),
                });
                break;
            case "Deleted":
                var id = rows[i].seq;
                $.ajax({
                    url:`http://ap-northeast-2.elb.amazonaws.com/l9a990-sampl{{namePlural}}/{{namePlural}}/${id}`,
                    method:"DELETE",
                });
                break;
        }     
    }           
}