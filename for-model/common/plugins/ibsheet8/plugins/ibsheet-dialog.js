/**
 * 제 품: IBSheet8 - Dialog Plugin
 * 버 전: v1.0.23 (20240926-15)
 * 회 사: (주)아이비리더스
 * 주 소: https://www.ibsheet.com
 * 전 화: 1644-5615
 */
(function(window, document) {
/*
 * ibsheet 내에 다이얼로그 (피봇,찾기,상세보기 등)
 * 해당 파일은 반드시 ibsheet.js 파일보다 뒤에 include 되어야 합니다.
 */
var _IBSheet = window['IBSheet'];
if (_IBSheet == null) {
  throw new Error('[ibsheet-dialog] undefined global object: IBSheet');
}

// IBSheet Plugins Object
var Fn = _IBSheet['Plugins'];

if (!Fn.PluginVers) Fn.PluginVers = {};
Fn.PluginVers.ibdialog = {
  name: 'ibdialog',
  version: '1.0.23-20240926-15'
};

/* 드래그 관리 객체 */
function DragObject() {
  this.dx = null;
  this.dy = null;
  this.dialogLeft = null;
  this.dialogTop = null;
  this.tag = null;
  this.orgTag = null;
}

var DOP = DragObject.prototype;

var drag = new DragObject();

/* 드래그 태그를 지움 */
DOP.ClearDragObj = function (org) {
  if (this.tag) {
    this.dx = null;
    this.dy = null;
    if (this.tag.parentNode) {
      this.tag.parentNode.removeChild(this.tag);
      this.tag = null;
    }

    if (org && this.orgTag && this.orgTag.parentNode && this.orgTag.parentNode) {
      var parent = this.orgTag.parentNode;
      parent.removeChild(this.orgTag);
      if (parent.childNodes.length == 0) {
        parent.innerHTML = "<i class='CellsInfo' style='color:gray;font-size:12px;'>이곳으로 대상 컬럼을 끌어놓으십시오.</i>";
      }
      this.orgTag = null;
    }
  }
};

/* 드래그 태그를 생성 */
DOP.MakeDragObj = function (object, ev) {
  this.ClearDragObj();

  this.dx = object.offsetWidth / 2;
  this.dy = parseInt(getComputedStyle(object.firstChild).marginBottom) / 2;

  var div = document.createElement('div');

  div.id = "myDragObj";
  div.appendChild(object.cloneNode(true));
  div.style.position = "absolute";
  div.style.left = (ev.clientX - this.dialogLeft - this.dx) + "px";
  div.style.top = (ev.clientY - this.dialogTop + this.dy) + "px";

  this.tag = div;
  this.orgTag = object;
  document.getElementById('DragTags').appendChild(div);
};

/* 드래그시 태그를 같이 움직임 */
DOP.MoveDragObj = function (ev) {
  if (this.tag) {
    this.tag.style.left = (ev.clientX - this.dialogLeft - this.dx) + "px";
    this.tag.style.top = (ev.clientY - this.dialogTop + this.dy) + "px";
  }
};

Fn.makeChart = function(chartType, categories, datas, extraOpt) {
  var options = {
    chart:{
    },
    colors: ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"],
    xAxis:{
      categories: categories,
      gridLineDashStyle:"dot",
      gridLineWidth:1,
      gridLineColor:"#DEDEDE"
    },
    yAxis:{
      title:{
        enabled: false
      },
      gridLineDashStyle:"longdash",
      gridLineWidth:1,
      gridLineColor:"#ADADAD"
    },
    plotOptions: {
      series:{
        shadow: false
      },
      column:{
        borderWidth:0
      },
      bar:{
        borderWidth:0
      },
      pie: {
        borderWidth:0,
        allowPointSelect: true,
        showInLegend: true
      },
    },
    series: [],
    tooltip: {
      headerFormat:  DLG.Tag.querySelector("#_none") && DLG.Tag.querySelector("#_none").checked ? "" : "{series.name}<br/>"
    }
  };
  
  // 기타 설정
  if(extraOpt && typeof extraOpt == "object"){
    // 두개 object merge
    options = IBSheet.__.extend(options, extraOpt);
  }

  
  if(chartType && chartType.indexOf("column") === 0){
    options.chart.type = "column"
  }else if(chartType && chartType.indexOf("bar") === 0){
    options.chart.type = "bar"
  }else if(chartType && chartType.indexOf("area") === 0){
    options.chart.type = "area"
  }else if(chartType == "pie"){
    options.chart.type = "pie";
    if (datas.length > 1) datas = datas.splice(0,1);
    datas[0].data = datas[0].data.map(function(d,idx){return [categories[idx],d]});
    if (!options.plotOptions.series.dataLabels) {
      options.plotOptions.series.dataLabels = {
        enabled: DLG.Tag.querySelector("#useDataLabel").checked
      }
    }
  }else if(chartType == "doughnut") {
    options.chart.type = "pie";
    if (datas.length > 1) datas = datas.splice(0,1);
    datas[0].data = datas[0].data.map(function(d,idx){return [categories[idx],d]});
    datas[0]["innerSize"] = "50%";
    if (!options.plotOptions.series.dataLabels) {
      options.plotOptions.series.dataLabels = {
        enabled: DLG.Tag.querySelector("#useDataLabel").checked
      }
    }
  }else if(chartType == "lineStep") {
    options.chart.type = "line";
    options.plotOptions.line = options.plotOptions.line||{};
    options.plotOptions.line.step = true;
  }else if(chartType == "combination1") {
  }else if(chartType == "combination2") {
  }else{
    options.chart.type = chartType;
  }

  if(chartType && chartType.indexOf("Stacked") > 0){
    options.plotOptions.series.stacking = "normal";
  }else if(chartType && chartType.indexOf("100") > 0){
    options.plotOptions.series.stacking = "percent";
  }

  // chart 생성
  createIBChart(document.querySelector("."+this.Style+"ChartChart"), "DLGChart", {width:"100%", height:"100%"});
  if (datas) for (var i = 0; i < datas.length; i++) options.series.push(datas[i]);

  DLGChart.setOptions(
    options,
    {redraw: true}
  );
  if (!datas) return false;
  else return true;
}
var _chartColorsArray = [
  ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"],
  ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1"],
  ["#D9ED92","#B5E48C","#99D98C","#76C893","#52B69A","#34A0A4","#168AAD","#1A759F","#1E6091","#184E77"],
  ["#001219","#005f73","#0a9396","#94d2bd","#e9d8a6","#ee9b00","#ca6702","#bb3e03","#ae2012","#9b2226"],
  ["#fbf8cc","#fde4cf","#ffcfd2","#f1c0e8","#cfbaf0","#a3c4f3","#90dbf4","#8eecf5","#98f5e1","#b9fbc0"]
];

var _ibThemePrimary = {
  IB: "#1A364E",
  IBGR: "#9398DD",
  IBMR: "#4161c0",
  IBMT: "#83c6c4",
  IBGY: "#CACACA"
}
/**
 * 차트 다이얼로그 생성
 * @param {string} chartType 
 * @param {object} extraOpt 
 * @param {Array[string]} categories 
 * @param {Array[object]} datas 
 * @param {string} categoryCol(카테고리 컬럼명 생략가능)
 * @returns none;
 */
Fn.showChartDialog = function (chartType, extraOpt) {
  this.closeDialog();
  this.hideTip();

  // 차트 plugins 추가 여부 확인
  if (typeof IBCharts == "undefined" || !Array.isArray(IBCharts)) {
    //ibchart.js가 없음
    this.showMessageTime(this.Lang.ChartDlg.ErrMsg.NeedChart);
    return;
  }
  if (!chartType) chartType = 'line';

  var typePreset = ["line", "spline", "lineStep", "column", "columnStacked", "columnStacked100", "bar", "barStacked", "barStacked100", "pie", "doughnut", "area", "areaStacked", "areaStacked100", "combination1", "combination2"];
  if (typePreset.indexOf(chartType) == -1) {
    this.showMessageTime(this.Lang.ChartDlg ? this.Lang.ChartDlg.ErrMsg.InvaildType : "Invalid Type Error");
    return;
  }

  var classPrefix = this.Style;

  // 기본 스타일 추가
  var styles = document.createElement("style");

  styles.innerHTML = 
  "."+classPrefix+"ChartPopup *{font-size:0.8rem;}"
  +"."+classPrefix+"ChartPopup p{margin: 0;}"
  +"."+classPrefix+"ChartPopup{"
  +"  margin: 0 auto;padding:10px;position:relative;display:flex;flex-direction:row;justify-content:space-between;align-items: flex-start;"
  +"}"
  +"."+classPrefix+"ChartExtraBtn{"
  +"  display: inline-flex;"
  +"  align-items: center;"
  +"  position: absolute;"
  +"  right: 30px;"
  +"  width: 150px;"
  +"  height: 16px;"
  +"  margin-right: 4px;"
  +"  justify-content: flex-end;"
  +"  text-align:right;"
  +"  transition: width 0.3s ease-in-out;"
  +"}"
  +"."+classPrefix+"ChartExtraBtn.active{"
  +"  width: 240px;"
  +"}"
  // 다이얼로그 상단 버튼 이미지
  +"."+classPrefix+"ChartExtraBtn>button{"
  +" padding:0;border:0;margin-left:8px;background-color:transparent;cursor:pointer;"
  +"}"
  +"."+classPrefix+"ChartExtraBtn>button.Zoom{"
  +"width:15px;height:15px;background-image: url(\"data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M17.7347 9.18841C18.1336 9.17442 18.4457 8.83965 18.4317 8.44069L18.1777 1.19749C18.164 0.807747 17.8436 0.499114 17.4536 0.500002L10.206 0.516496C9.8068 0.517405 9.48392 0.841762 9.48482 1.24097L9.48565 1.60238C9.48656 2.00159 9.81091 2.32447 10.2101 2.32357L14.9741 2.31272L10.6767 6.77363C10.3997 7.06113 10.4083 7.51872 10.6958 7.79569L10.956 8.04643C11.2436 8.3234 11.7011 8.31485 11.9781 8.02735L16.4463 3.38909L16.6258 8.50403C16.6397 8.90299 16.9745 9.21507 17.3735 9.20108L17.7347 9.18841ZM8.24567 12.2403C8.52428 11.9544 8.51836 11.4967 8.23245 11.2181L7.97361 10.9659C7.6877 10.6873 7.23007 10.6932 6.95146 10.9791L2.45667 15.5917L2.30662 10.4758C2.29491 10.0767 1.96194 9.76274 1.5629 9.77444L1.20164 9.78504C0.802607 9.79674 0.488612 10.1297 0.500317 10.5287L0.712812 17.7733C0.724246 18.1631 1.04285 18.4736 1.43283 18.4749L8.68044 18.5C9.07964 18.5014 9.40438 18.1789 9.40576 17.7797L9.40701 17.4183C9.40839 17.0191 9.08589 16.6943 8.68669 16.6929L3.92278 16.6764L8.24567 12.2403Z' fill='%23FFF'/%3E%3C/svg%3E%0A\");background-size:15px;background-repeat:no-repeat;"
  +"}"
  +"."+classPrefix+"ChartExtraBtn>button.Zoom.active{"
  +"width:15px;height:15px;background-image: url(\"data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M17.7347 9.18841C18.1336 9.17442 18.4457 8.83965 18.4317 8.44069L18.1777 1.19749C18.164 0.807747 17.8436 0.499114 17.4536 0.500002L10.206 0.516496C9.8068 0.517405 9.48392 0.841762 9.48482 1.24097L9.48565 1.60238C9.48656 2.00159 9.81091 2.32447 10.2101 2.32357L14.9741 2.31272L10.6767 6.77363C10.3997 7.06113 10.4083 7.51872 10.6958 7.79569L10.956 8.04643C11.2436 8.3234 11.7011 8.31485 11.9781 8.02735L16.4463 3.38909L16.6258 8.50403C16.6397 8.90299 16.9745 9.21507 17.3735 9.20108L17.7347 9.18841ZM8.24567 12.2403C8.52428 11.9544 8.51836 11.4967 8.23245 11.2181L7.97361 10.9659C7.6877 10.6873 7.23007 10.6932 6.95146 10.9791L2.45667 15.5917L2.30662 10.4758C2.29491 10.0767 1.96194 9.76274 1.5629 9.77444L1.20164 9.78504C0.802607 9.79674 0.488612 10.1297 0.500317 10.5287L0.712812 17.7733C0.724246 18.1631 1.04285 18.4736 1.43283 18.4749L8.68044 18.5C9.07964 18.5014 9.40438 18.1789 9.40576 17.7797L9.40701 17.4183C9.40839 17.0191 9.08589 16.6943 8.68669 16.6929L3.92278 16.6764L8.24567 12.2403Z' fill='%23FF0'/%3E%3C/svg%3E%0A\");background-size:15px;background-repeat:no-repeat;"
  +"}"
   +"."+classPrefix+"ChartExtraBtn>button.Config{"
  +"width:15px;height:15px;background-image: url(\"data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.4481 1.49114C10.4855 0.169623 8.51446 0.16962 7.55191 1.49113L6.96808 2.29268C6.79063 2.53631 6.49174 2.66012 6.19399 2.61332L5.21439 2.45937C3.59931 2.20554 2.20554 3.59931 2.45937 5.21439L2.61332 6.19399C2.66012 6.49174 2.53631 6.79063 2.29268 6.96808L1.49114 7.55191C0.169623 8.51446 0.169619 10.4855 1.49114 11.4481L2.29268 12.0319C2.53631 12.2094 2.66012 12.5083 2.61332 12.806L2.45937 13.7856C2.20554 15.4007 3.5993 16.7945 5.21439 16.5406L6.19399 16.3867C6.49174 16.3399 6.79063 16.4637 6.96808 16.7073L7.55191 17.5089C8.51446 18.8304 10.4855 18.8304 11.4481 17.5089L12.0319 16.7073C12.2094 16.4637 12.5083 16.3399 12.806 16.3867L13.7856 16.5406C15.4007 16.7945 16.7945 15.4007 16.5406 13.7856L16.3867 12.806C16.3399 12.5083 16.4637 12.2094 16.7073 12.0319L17.5089 11.4481C18.8304 10.4855 18.8304 8.51446 17.5089 7.55191L16.7073 6.96808C16.4637 6.79063 16.3399 6.49174 16.3867 6.19399L16.5406 5.21439C16.7945 3.59931 15.4007 2.20554 13.7856 2.45937L12.806 2.61332C12.5083 2.66012 12.2094 2.53631 12.0319 2.29268L11.4481 1.49114ZM8.85064 2.43709C9.17149 1.99659 9.82851 1.99659 10.1494 2.43709L10.7332 3.23864C11.2655 3.96952 12.1622 4.34093 13.0555 4.20055L14.0351 4.0466C14.5734 3.96199 15.038 4.42658 14.9534 4.96494L14.7994 5.94455C14.6591 6.83779 15.0305 7.73446 15.7614 8.26681L16.5629 8.85064C17.0034 9.17149 17.0034 9.82851 16.5629 10.1494L15.7614 10.7332C15.0305 11.2655 14.6591 12.1622 14.7994 13.0555L14.9534 14.0351C15.038 14.5734 14.5734 15.038 14.0351 14.9534L13.0555 14.7994C12.1622 14.6591 11.2655 15.0305 10.7332 15.7614L10.1494 16.5629C9.82851 17.0034 9.17149 17.0034 8.85063 16.5629L8.26681 15.7614C7.73446 15.0305 6.83779 14.6591 5.94455 14.7994L4.96494 14.9534C4.42658 15.038 3.96199 14.5734 4.0466 14.0351L4.20055 13.0555C4.34094 12.1622 3.96952 11.2655 3.23864 10.7332L2.43709 10.1494C1.99659 9.82851 1.99659 9.17149 2.43709 8.85063L3.23864 8.26681C3.96952 7.73446 4.34093 6.83779 4.20055 5.94455L4.0466 4.96494C3.96199 4.42658 4.42658 3.96199 4.96494 4.0466L5.94455 4.20055C6.83779 4.34094 7.73446 3.96952 8.26681 3.23864L8.85064 2.43709ZM7.41127 9.33933C7.41127 8.27449 8.27449 7.41127 9.33933 7.41127C10.4042 7.41127 11.2674 8.27449 11.2674 9.33933C11.2674 10.4042 10.4042 11.2674 9.33933 11.2674C8.27449 11.2674 7.41127 10.4042 7.41127 9.33933ZM9.33933 5.80456C7.38713 5.80456 5.80456 7.38713 5.80456 9.33933C5.80456 11.2915 7.38713 12.8741 9.33933 12.8741C11.2915 12.8741 12.8741 11.2915 12.8741 9.33933C12.8741 7.38713 11.2915 5.80456 9.33933 5.80456Z' fill='%23FFF'/%3E%3C/svg%3E%0A\");background-size:15px;background-repeat:no-repeat;"
  +"}"
  +"."+classPrefix+"ChartExtraBtn>button.Config.active{"
  +"width:15px;height:15px;background-image: url(\"data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.4481 1.49114C10.4855 0.169623 8.51446 0.16962 7.55191 1.49113L6.96808 2.29268C6.79063 2.53631 6.49174 2.66012 6.19399 2.61332L5.21439 2.45937C3.59931 2.20554 2.20554 3.59931 2.45937 5.21439L2.61332 6.19399C2.66012 6.49174 2.53631 6.79063 2.29268 6.96808L1.49114 7.55191C0.169623 8.51446 0.169619 10.4855 1.49114 11.4481L2.29268 12.0319C2.53631 12.2094 2.66012 12.5083 2.61332 12.806L2.45937 13.7856C2.20554 15.4007 3.5993 16.7945 5.21439 16.5406L6.19399 16.3867C6.49174 16.3399 6.79063 16.4637 6.96808 16.7073L7.55191 17.5089C8.51446 18.8304 10.4855 18.8304 11.4481 17.5089L12.0319 16.7073C12.2094 16.4637 12.5083 16.3399 12.806 16.3867L13.7856 16.5406C15.4007 16.7945 16.7945 15.4007 16.5406 13.7856L16.3867 12.806C16.3399 12.5083 16.4637 12.2094 16.7073 12.0319L17.5089 11.4481C18.8304 10.4855 18.8304 8.51446 17.5089 7.55191L16.7073 6.96808C16.4637 6.79063 16.3399 6.49174 16.3867 6.19399L16.5406 5.21439C16.7945 3.59931 15.4007 2.20554 13.7856 2.45937L12.806 2.61332C12.5083 2.66012 12.2094 2.53631 12.0319 2.29268L11.4481 1.49114ZM8.85064 2.43709C9.17149 1.99659 9.82851 1.99659 10.1494 2.43709L10.7332 3.23864C11.2655 3.96952 12.1622 4.34093 13.0555 4.20055L14.0351 4.0466C14.5734 3.96199 15.038 4.42658 14.9534 4.96494L14.7994 5.94455C14.6591 6.83779 15.0305 7.73446 15.7614 8.26681L16.5629 8.85064C17.0034 9.17149 17.0034 9.82851 16.5629 10.1494L15.7614 10.7332C15.0305 11.2655 14.6591 12.1622 14.7994 13.0555L14.9534 14.0351C15.038 14.5734 14.5734 15.038 14.0351 14.9534L13.0555 14.7994C12.1622 14.6591 11.2655 15.0305 10.7332 15.7614L10.1494 16.5629C9.82851 17.0034 9.17149 17.0034 8.85063 16.5629L8.26681 15.7614C7.73446 15.0305 6.83779 14.6591 5.94455 14.7994L4.96494 14.9534C4.42658 15.038 3.96199 14.5734 4.0466 14.0351L4.20055 13.0555C4.34094 12.1622 3.96952 11.2655 3.23864 10.7332L2.43709 10.1494C1.99659 9.82851 1.99659 9.17149 2.43709 8.85063L3.23864 8.26681C3.96952 7.73446 4.34093 6.83779 4.20055 5.94455L4.0466 4.96494C3.96199 4.42658 4.42658 3.96199 4.96494 4.0466L5.94455 4.20055C6.83779 4.34094 7.73446 3.96952 8.26681 3.23864L8.85064 2.43709ZM7.41127 9.33933C7.41127 8.27449 8.27449 7.41127 9.33933 7.41127C10.4042 7.41127 11.2674 8.27449 11.2674 9.33933C11.2674 10.4042 10.4042 11.2674 9.33933 11.2674C8.27449 11.2674 7.41127 10.4042 7.41127 9.33933ZM9.33933 5.80456C7.38713 5.80456 5.80456 7.38713 5.80456 9.33933C5.80456 11.2915 7.38713 12.8741 9.33933 12.8741C11.2915 12.8741 12.8741 11.2915 12.8741 9.33933C12.8741 7.38713 11.2915 5.80456 9.33933 5.80456Z' fill='%23FF0'/%3E%3C/svg%3E%0A\");background-size:15px;background-repeat:no-repeat;"
  +"}"
  +"."+classPrefix+"ChartExtraBtn>button.toggleDown{"
  +"width:15px;height:15px;background-image: url(\"data:image/svg+xml,%3Csvg width='20' height='19' viewBox='0 0 20 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.22 0.5C10.6176 0.5 10.94 0.822355 10.94 1.22L10.94 11.3366L14.4767 7.91396C14.7625 7.63743 15.2183 7.6449 15.4948 7.93065L15.7452 8.18935C16.0217 8.4751 16.0142 8.93091 15.7285 9.20745L10.5407 14.2279C10.2616 14.498 9.81844 14.498 9.5393 14.2279L4.35151 9.20745C4.06577 8.93091 4.05829 8.4751 4.33482 8.18935L4.58518 7.93065C4.86171 7.6449 5.31752 7.63743 5.60327 7.91396L9.14 11.3366L9.14 1.22C9.14 0.822355 9.46236 0.5 9.86 0.5H10.22ZM0.5 17.42C0.5 17.0224 0.822355 16.7 1.22 16.7H18.86C19.2576 16.7 19.58 17.0224 19.58 17.42V17.78C19.58 18.1776 19.2576 18.5 18.86 18.5H1.22C0.822354 18.5 0.5 18.1776 0.5 17.78V17.42Z' fill='%23FFF'/%3E%3C/svg%3E%0A\");background-size:15px;background-repeat:no-repeat;"
  +"}"
  +"."+classPrefix+"ChartExtraBtn.active>button.toggleDown{"
  +"background-image: url(\"data:image/svg+xml,%3Csvg width='20' height='19' viewBox='0 0 20 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.22 0.5C10.6176 0.5 10.94 0.822355 10.94 1.22L10.94 11.3366L14.4767 7.91396C14.7625 7.63743 15.2183 7.6449 15.4948 7.93065L15.7452 8.18935C16.0217 8.4751 16.0142 8.93091 15.7285 9.20745L10.5407 14.2279C10.2616 14.498 9.81844 14.498 9.5393 14.2279L4.35151 9.20745C4.06577 8.93091 4.05829 8.4751 4.33482 8.18935L4.58518 7.93065C4.86171 7.6449 5.31752 7.63743 5.60327 7.91396L9.14 11.3366L9.14 1.22C9.14 0.822355 9.46236 0.5 9.86 0.5H10.22ZM0.5 17.42C0.5 17.0224 0.822355 16.7 1.22 16.7H18.86C19.2576 16.7 19.58 17.0224 19.58 17.42V17.78C19.58 18.1776 19.2576 18.5 18.86 18.5H1.22C0.822354 18.5 0.5 18.1776 0.5 17.78V17.42Z' fill='%23FF0'/%3E%3C/svg%3E%0A\");"
  +"}"
  // +"."+classPrefix+"ChartExtraBtn.active>button.Config,."+classPrefix+"ChartExtraBtn.active>button.Zoom{"
  // +"width: 0;height: 0; overflow: hidden;"
  // +"  display: none;"
  // +"}"
  +"."+classPrefix+"ChartExtraBtn>button.btnDown{"
  +" overflow: hidden;"
  +" max-width: 0px;"
  +" transition: all .13s ease-in-out;"
  +" margin: 0px;"
  +" margin-top: 2px;"
  +" padding: 0px;"
  +" color: #fff;"
  +" font-weight: 100;"
  +"}"
  +"."+classPrefix+"ChartExtraBtn.active>button.btnDown{"
  +" max-width: none;"
  +" height: auto;"
  +" margin-left: 8px;"
  +" margin-right: 4px;"
  +"}"
  +"."+classPrefix+"ChartPopup>."+classPrefix+"ChartShow{"
  +"  height: 520px;"
  +"  flex-grow:1;"
  +"}"
  +"."+classPrefix+"ChartPopup>."+classPrefix+"ChartShow>."+classPrefix+"ChartChart{"
  +"  height: 100%;"
  +"}"
  +"."+classPrefix+"ChartPopup ."+classPrefix+"ChartConfig{"
  +"  opacity:0;"
  +"  height:520px;"
  +"  width:0px;"
  +"  z-index:999;"
  +"  transform:translateX(100%);"
  // +"  background-color:rgba(240, 240, 240, 0.7);"
  +"  overflow:hidden;"
  +"  transition: transform 0.4s ease-in-out;"
  +"}"
  +"."+classPrefix+"ChartPopup ."+classPrefix+"ChartConfig>ul{"
  +"  list-style:none;"
  +"  margin:0;"
  +"  padding:0;"
  +"  height: 42px;"
  +"  display:flex;"
  +"  justify-content:space-between;"
  +"  align-items: flex-start;"
  +"}"
  +"."+classPrefix+"ChartPopup ."+classPrefix+"ChartConfig>ul>li{"
  +"  display:  inline-block;"
  +"  flex-grow:1; "
  +"  float:left;  "
  +"  text-align:center; "
  +"  background :#f9f9f9;"
  +"  box-sizing:border-box!important;"
  +"  height: 40px;"
  +"}"
  +"."+classPrefix+"ChartPopup ."+classPrefix+"ChartConfig>ul>li>button{"
  +"  padding:0;"
  +"  width:100%;"
  +"  line-height:40px;"
  +"  height:40px;"
  +"  border:0;"
  +"  color: #000;"
  +"  cursor: pointer;"
  +"  transition: background 0.3s ease-in-out;"
  +"}"
  +"."+classPrefix+"ChartPopup ."+classPrefix+"ChartConfig>ul>li>button.active, ."+classPrefix+"ChartPopup ."+classPrefix+"ChartConfig>ul>li>button:hover{"
  +"  background-color: "+ _ibThemePrimary[classPrefix] +";"
  +"  color: #EEEEEE;"
  +"}"
  +"."+classPrefix+"ChartTabCon{"
  // +"  visibility:hidden; "
  +"  display:none; "
  +"  text-align:left; "
  +"  padding: 0px;"
  // +"  padding-top: 0;"
  // +"  position:absolute;"
  +"  width: 100%;"
  +"  background-color:#FAFAFA;"
  // +"  left:420px;"
  +"  min-height:250px;"
  +"  height: 100%;"
  +"  box-sizing: border-box!important; "
  +"  overflow-y:auto;"
  +"  scrollbar-width: thin;"
  +"}"
  +"#tab2Con ul{"
  +"  list-style:none;"
  +"}"
  +"."+classPrefix+"ChartTabCon>ul{"
  +"  list-style:none;"
  +"}"
  +"."+classPrefix+"ChartTabContent {"
  +"  height: 476px;"
  +"}"

  +"."+classPrefix+"ChartConfig.active ."+classPrefix+"ChartTab.active ."+classPrefix+"ChartTabCon{"
  // +"  visibiliy: visible;"
  +"  display: block;"
  +"}"
  +"."+classPrefix+"ChartAccHeader {"
  +"  position: relative;"
  +"  display:flex;"
  +"  align-items:center;"
  +"  padding:5px 3px 3px 5px;"
  +"  font-weight: 500;"
  +"  line-height: 1.5rem;"
  +"  background-color:rgba(210, 210, 210, 0.8);"
  +"  border-bottom: 1px solid #888888;"
  +"  cursor: pointer;"
  +"}"
  // +"."+classPrefix+"ChartAccHeader:before {"
  // +"    position:absolute;"
  // +"    width:20px;height: 20px;"
  // +"    margin-top:-3px;"
  // +"    transition: all ease 0.5s;"
  // +"    content:url(\"data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.5 7L14.5 12L9.5 17' stroke='%23000000' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\");"
  // +"    content:'≡ '"
  // +"}"
  +"."+classPrefix+"ChartAccHeader:before {"
  +"  content:'';"
  +"  display: block;"
  +"  width: 10px;"
  +"  height: 5px;"
  +"  margin-right: 4px;"
  +"  border-top: 1px solid black;"
  +"  border-bottom: 1px solid var(--chart-primary-" + classPrefix + ");;"
  +"}"
  +"."+classPrefix+"ChartAccHeader:after {"
  +"  content:'';"
  +"  position: absolute;"
  +"  display: block;"
  +"  width: 10px;"
  +"  height: 1px;"
  +"  margin-right: 4px;"
  +"  border-bottom:1px solid var(--chart-primary-" + classPrefix + ");;"
  +"}"
  // +"."+classPrefix+"ChartAccHeader.rotated:before {"
  // +"    position:absolute;"
  // +"    display:inline-block;"
  // +"    width:20px;height: 20px;"
  // +"    margin-top:-3px;"
  // +"   transform: rotate(90deg) translateY( -5px ); "
  // +"    content:url(\"data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%5Cr%5Cn%3Cpath d='M9.5 7L14.5 12L9.5 17' stroke='%23000000' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\");"
  // +"}"

  +"."+classPrefix+"ChartAccHeaderToggle {"
  +"  flex: 1;"
  +"  display: flex;"
  +"  justify-content: flex-end;"
  +"}"
  +"."+classPrefix+"ChartAccHeaderToggle label{"
  +"  display: flex;"
  +"  align-items: center;"
  +"  line-height: 1.5rem;"
  +"  cursor: pointer;"
  +"}"
  +"."+classPrefix+"ChartAccContent {"
  +"  padding: 10px 8px;"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette {"
  +"  display: flex;"
  +"  flex-direction: column;"
  +"  padding-top: 14px;"
  +"}"
  +"div#tab1Con ."+classPrefix+"ChartAccContent ul{list-style-type:none;display:flex;justify-content:space-around;padding:0}"
  +"div#tab2Con ."+classPrefix+"ChartAccContent ul, div#tab1Con ."+classPrefix+"ChartAccContent ul{"
  +"padding:0;"
  +"margin:0;"
  +"}"
  +"#tab3Con ."+classPrefix+"ChartAccContent:not(.palette), #tab2Con ."+classPrefix+"ChartAccContent li, #tab2Con ."+classPrefix+"ChartAccContent div.__checkAllDiv{"
  +"  display: flex;"
  +"  align-items: center;"
  +"}"
  +"#tab2Con ."+classPrefix+"ChartAccContent div.__checkAllDiv{"
  +"  margin-bottom: 4px;"
  +"}"
  +"#tab2Con ."+classPrefix+"ChartAccContent div.__checkAllDiv label{"
  +"  margin-right: 0px !important;"
  +"  margin-left: 4px;"
  +"}"
  +"."+classPrefix+"ChartAccContent:not(.palette) input[type=radio],."+classPrefix+"ChartAccContent:not(.palette) input[type=checkbox] {"
  +"  margin:0"
  +"}"
  +"div:not(#tab1Con) ."+classPrefix+"ChartAccContent:not(.palette) label{"
  +"  margin-left: 4px;"
  +"  margin-right: 8px;"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette [type=radio]{position: absolute;opacity: 0;width: 0;height: 0;}"
  +"."+classPrefix+"ChartAccContent.palette [type=radio] + div {"
  +"  cursor: pointer;"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette [type=radio]:checked + div {"
  +"  outline: 3px solid #7FFF00;"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette>label {"
  +"  width: 100%;"
  +"  margin-bottom: 6px;"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette>label:last-child {"
  +"  margin-bottom: 0px;"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette>label>div {"
  +"  display:flex;"
  +"  justify-content:space-between;"
  +"  height:20px;"
  +"  border-radius: 10px;"
  +"  margin-bottom: 15px;"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette>label>div:last-child {"
  +"  margin-bottom: 0px;"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette>label>div>div {"
  +"  flex-grow:1"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette>label>div>div:first-child {"
  +"  border-top-left-radius:10px;"
  +"  border-bottom-left-radius:10px;"
  +"}"
  +"."+classPrefix+"ChartAccContent.palette>label>div>div:last-child {"
  +"  border-top-right-radius:10px;"
  +"  border-bottom-right-radius:10px;"
  +"}"
  +".combinationDiv {"
  +"  display:flex;"
  +"  justify-content:space-between;"
  +"}"
  +"div#tab2Con .combinationDiv ul{"
  +"  padding-left: 17px;"
  +"}"
  // radio image
  +"div#tab1Con ."+classPrefix+"ChartAccContent [type=radio] {"
  +"  position:absolute;opacity:0;width:0;height:0;"
  +"}"
  +"div#tab1Con ."+classPrefix+"ChartAccContent [type=radio] + img{"
  +"  cursor: pointer;"
  +"}"
  +"div#tab1Con ."+classPrefix+"ChartAccContent [type=radio]:checked + img {"
  +"  outline: 4px ridge #4094dd;border-radius:3px;"
  +"}"

  // chart image
  /*
  +"div#tab1Con input[type=radio]#column+img{width:52px;height:52px}"
  +"div#tab1Con input[type=radio]#column+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 32C6 30.8954 6.89543 30 8 30H14C15.1046 30 16 30.8954 16 32V51H6V32Z' fill='%23B3D1EC'/%3E%3Cpath d='M21 21C21 19.8954 21.8954 19 23 19H29C30.1046 19 31 19.8954 31 21V51H21V21Z' fill='%235B81B4'/%3E%3Cpath d='M36 9C36 7.89543 36.8954 7 38 7H44C45.1046 7 46 7.89543 46 9V51H36V9Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#columnStacked+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 32C6 30.8954 6.89543 30 8 30H14C15.1046 30 16 30.8954 16 32V51H6V32Z' fill='%23B3D1EC'/%3E%3Cpath d='M21 21C21 19.8954 21.8954 19 23 19H29C30.1046 19 31 19.8954 31 21V51H21V21Z' fill='%23B3D1EC'/%3E%3Cpath d='M36 9C36 7.89543 36.8954 7 38 7H44C45.1046 7 46 7.89543 46 9V51H36V9Z' fill='%23B3D1EC'/%3E%3Cpath d='M6 32C6 30.8954 6.89543 30 8 30H14C15.1046 30 16 30.8954 16 32V44H6V32Z' fill='%235B81B4'/%3E%3Cpath d='M21 21C21 19.8954 21.8954 19 23 19H29C30.1046 19 31 19.8954 31 21V38H21V21Z' fill='%235B81B4'/%3E%3Cpath d='M36 9C36 7.89543 36.8954 7 38 7H44C45.1046 7 46 7.89543 46 9V34H36V9Z' fill='%235B81B4'/%3E%3Cpath d='M6 32C6 30.8954 6.89543 30 8 30H14C15.1046 30 16 30.8954 16 32V36H6V32Z' fill='%233D5575'/%3E%3Cpath d='M21 21C21 19.8954 21.8954 19 23 19H29C30.1046 19 31 19.8954 31 21V26H21V21Z' fill='%233D5575'/%3E%3Cpath d='M36 9C36 7.89543 36.8954 7 38 7H44C45.1046 7 46 7.89543 46 9V17H36V9Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#columnStacked100+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9.00002C6 7.89545 6.89543 7.00002 8 7.00002H14C15.1046 7.00002 16 7.89545 16 9.00002V51H6V9.00002Z' fill='%23B3D1EC'/%3E%3Cpath d='M21 9.00002C21 7.89545 21.8954 7.00002 23 7.00002H29C30.1046 7.00002 31 7.89545 31 9.00002V51H21V9.00002Z' fill='%23B3D1EC'/%3E%3Cpath d='M36 9.00001C36 7.89544 36.8954 7.00001 38 7.00001H44C45.1046 7.00001 46 7.89544 46 9.00001V51H36V9.00001Z' fill='%23B3D1EC'/%3E%3Cpath d='M6 9.00002C6 7.89545 6.89543 7.00002 8 7.00002H14C15.1046 7.00002 16 7.89545 16 9.00002V38H6V9.00002Z' fill='%235B81B4'/%3E%3Cpath d='M21 9.00002C21 7.89545 21.8954 7.00002 23 7.00002H29C30.1046 7.00002 31 7.89545 31 9.00002V32H21V9.00002Z' fill='%235B81B4'/%3E%3Cpath d='M36 9.00001C36 7.89544 36.8954 7.00001 38 7.00001H44C45.1046 7.00001 46 7.89544 46 9.00001V28H36V9.00001Z' fill='%235B81B4'/%3E%3Cpath d='M6 9.00002C6 7.89545 6.89543 7.00002 8 7.00002H14C15.1046 7.00002 16 7.89545 16 9.00002V21H6V9.00002Z' fill='%233D5575'/%3E%3Cpath d='M21 9.00002C21 7.89545 21.8954 7.00002 23 7.00002H29C30.1046 7.00002 31 7.89545 31 9.00002V17H21V9.00002Z' fill='%233D5575'/%3E%3Cpath d='M36 9.00001C36 7.89544 36.8954 7.00001 38 7.00001H44C45.1046 7.00001 46 7.89544 46 9.00001V14H36V9.00001Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 1.00001C0.249996 0.585794 0.585781 0.250005 0.999996 0.250005C1.41421 0.250005 1.75 0.585794 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  
  +"div#tab1Con input[type=radio]#bar+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6C21.1046 6 22 6.89543 22 8L22 14C22 15.1046 21.1046 16 20 16L1 16L1 6L20 6Z' fill='%23B3D1EC'/%3E%3Cpath d='M31 21C32.1046 21 33 21.8954 33 23L33 29C33 30.1046 32.1046 31 31 31L1 31L1 21L31 21Z' fill='%235B81B4'/%3E%3Cpath d='M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L1 46L1 36L43 36Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#barStacked+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6C21.1046 6 22 6.89543 22 8L22 14C22 15.1046 21.1046 16 20 16L1 16L1 6L20 6Z' fill='%23B3D1EC'/%3E%3Cpath d='M31 21C32.1046 21 33 21.8954 33 23L33 29C33 30.1046 32.1046 31 31 31L1 31L1 21L31 21Z' fill='%23B3D1EC'/%3E%3Cpath d='M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L1 46L1 36L43 36Z' fill='%23B3D1EC'/%3E%3Cpath d='M20 6C21.1046 6 22 6.89543 22 8L22 14C22 15.1046 21.1046 16 20 16L8 16L8 6L20 6Z' fill='%235B81B4'/%3E%3Cpath d='M31 21C32.1046 21 33 21.8954 33 23L33 29C33 30.1046 32.1046 31 31 31L14 31L14 21L31 21Z' fill='%235B81B4'/%3E%3Cpath d='M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L18 46L18 36L43 36Z' fill='%235B81B4'/%3E%3Cpath d='M20 6C21.1046 6 22 6.89543 22 8L22 14C22 15.1046 21.1046 16 20 16L16 16L16 6L20 6Z' fill='%233D5575'/%3E%3Cpath d='M31 21C32.1046 21 33 21.8954 33 23L33 29C33 30.1046 32.1046 31 31 31L26 31L26 21L31 21Z' fill='%233D5575'/%3E%3Cpath d='M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L35 46L35 36L43 36Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 1C0.249996 0.58579 0.585781 0.250002 0.999996 0.250002C1.41421 0.250002 1.75 0.58579 1.75 1L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#barStacked100+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M43 6C44.1046 6 45 6.89543 45 8L45 14C45 15.1046 44.1046 16 43 16L1 16L1 6L43 6Z' fill='%23B3D1EC'/%3E%3Cpath d='M43 21C44.1046 21 45 21.8954 45 23L45 29C45 30.1046 44.1046 31 43 31L1 31L1 21L43 21Z' fill='%23B3D1EC'/%3E%3Cpath d='M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L1 46L1 36L43 36Z' fill='%23B3D1EC'/%3E%3Cpath d='M43 6C44.1046 6 45 6.89543 45 8L45 14C45 15.1046 44.1046 16 43 16L14 16L14 6L43 6Z' fill='%235B81B4'/%3E%3Cpath d='M43 21C44.1046 21 45 21.8954 45 23L45 29C45 30.1046 44.1046 31 43 31L20 31L20 21L43 21Z' fill='%235B81B4'/%3E%3Cpath d='M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L24 46L24 36L43 36Z' fill='%235B81B4'/%3E%3Cpath d='M43 6C44.1046 6 45 6.89543 45 8L45 14C45 15.1046 44.1046 16 43 16L31 16L31 6L43 6Z' fill='%233D5575'/%3E%3Cpath d='M43 21C44.1046 21 45 21.8954 45 23L45 29C45 30.1046 44.1046 31 43 31L35 31L35 21L43 21Z' fill='%233D5575'/%3E%3Cpath d='M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L38 46L38 36L43 36Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 1C0.249996 0.58579 0.585781 0.250002 0.999996 0.250002C1.41421 0.250002 1.75 0.58579 1.75 1L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#line+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1.16793 7.94531C1.47429 7.48579 2.09516 7.36161 2.55468 7.66796L15.8028 16.5H34.5C34.7652 16.5 35.0196 16.6054 35.2071 16.7929L48.7071 30.2929C49.0976 30.6834 49.0976 31.3166 48.7071 31.7071C48.3166 32.0976 47.6834 32.0976 47.2929 31.7071L34.0858 18.5H15.5C15.3026 18.5 15.1096 18.4416 14.9453 18.3321L1.44528 9.33206C0.985755 9.02571 0.861582 8.40484 1.16793 7.94531Z' fill='%23B3D1EC'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.719107 20.8753C1.06412 20.444 1.69341 20.3741 2.12467 20.7191L11.7633 28.4301L29.3091 25.0184C29.5568 24.9702 29.8136 25.0175 30.0279 25.1507L48.5279 36.6507C48.997 36.9423 49.1408 37.5589 48.8493 38.0279C48.5577 38.497 47.9411 38.6409 47.472 38.3493L29.3055 27.0566L11.6908 30.4816C11.4027 30.5377 11.1045 30.4642 10.8753 30.2809L0.875281 22.2809C0.444019 21.9359 0.374097 21.3066 0.719107 20.8753Z' fill='%235B81B4'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M49.816 14.422C50.1353 14.8727 50.0287 15.4968 49.578 15.816L37.7824 24.1712L31.3944 36.9472C31.1905 37.3551 30.7364 37.5733 30.2905 37.4778L16.7259 34.5711L2.58652 44.8099C2.1392 45.1339 1.51399 45.0338 1.19007 44.5865C0.866149 44.1392 0.966183 43.514 1.4135 43.19L15.9135 32.69C16.1431 32.5238 16.4324 32.4628 16.7095 32.5222L29.952 35.3599L36.1056 23.0528C36.1791 22.9057 36.2878 22.779 36.422 22.684L48.422 14.184C48.8727 13.8647 49.4968 13.9713 49.816 14.422Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#spline+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1.27074 7.81574C1.64861 7.41303 2.28139 7.39286 2.68414 7.77067L2.68818 7.77446L2.70284 7.78812L2.76348 7.84428C2.81756 7.89416 2.89855 7.96842 3.00428 8.06413C3.21578 8.25559 3.52606 8.53267 3.91771 8.87195C4.70155 9.55098 5.80853 10.4767 7.09976 11.4626C9.70838 13.4544 12.9718 15.6155 15.8125 16.5501C18.9736 17.5901 21.6979 17.0069 24.6675 16.3711C24.7323 16.3573 24.7972 16.3434 24.8623 16.3295C27.8736 15.6856 31.1398 15.0302 34.8817 16.5757C38.569 18.0988 42.076 21.6427 44.6027 24.6776C45.8821 26.2143 46.9409 27.6588 47.68 28.719C48.0499 29.2496 48.3405 29.6851 48.5394 29.9893C48.6389 30.1414 48.7156 30.2608 48.7678 30.3429C48.7797 30.3616 48.7903 30.3783 48.7997 30.3931C48.8108 30.4108 48.8202 30.4256 48.8276 30.4375L48.8435 30.4628L48.8491 30.4718C48.8492 30.472 48.8497 30.4729 48 31L48.8497 30.4729C49.1409 30.9422 48.9964 31.5586 48.5271 31.8498C48.0579 32.1409 47.4415 31.9965 47.1503 31.5273C47.1503 31.5273 47.1503 31.5273 47.1503 31.5273M47.1503 31.5273L47.1497 31.5264L47.1468 31.5217L47.134 31.5012C47.1223 31.4826 47.1043 31.4541 47.0804 31.4165C47.0324 31.3411 46.9603 31.2288 46.8657 31.084C46.6763 30.7945 46.3967 30.3754 46.0393 29.8628C45.3239 28.8365 44.2998 27.4396 43.0656 25.9572C40.5651 22.9537 37.3221 19.7476 34.1182 18.4243C31.0021 17.1372 28.2925 17.6412 25.2804 18.2853C25.1751 18.3078 25.0694 18.3305 24.9632 18.3533C22.0688 18.9749 18.8706 19.6617 15.1874 18.4499C12.0093 17.4043 8.5227 15.0654 5.88604 13.0522C4.55462 12.0356 3.41514 11.0827 2.60818 10.3836C2.20443 10.0339 1.88322 9.74705 1.66209 9.54687C1.5515 9.44677 1.46589 9.36828 1.40744 9.31437L1.3404 9.25228L1.32266 9.23574L1.31643 9.22991C1.31628 9.22977 1.31571 9.22924 1.99997 8.5L1.31643 9.22991C0.91368 8.852 0.89283 8.21849 1.27074 7.81574' fill='%23B3D1EC'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.2863 20.8822C2.28634 20.8822 2.28626 20.8821 2.2863 20.8822L2.2887 20.8852L2.29896 20.8982L2.34245 20.9526C2.38147 21.0012 2.44023 21.0737 2.51714 21.1672C2.67102 21.3541 2.8973 21.6241 3.18333 21.9521C3.75624 22.6091 4.56467 23.4936 5.5079 24.4064C6.45331 25.3213 7.52002 26.2508 8.60913 27.0066C9.70874 27.7695 10.7727 28.314 11.7169 28.5238C12.609 28.7221 13.6683 28.6087 14.9538 28.2609C16.0322 27.9691 17.1782 27.5402 18.4364 27.0694C18.6812 26.9778 18.9302 26.8846 19.1838 26.7905C22.2273 25.6614 25.8244 24.4396 29.6478 25.011C34.1228 25.6798 38.9209 28.6955 42.5104 31.4256C44.326 32.8066 45.8727 34.1461 46.9654 35.1403C47.5122 35.6377 47.9465 36.0497 48.2452 36.3385C48.3946 36.4829 48.5101 36.5966 48.5889 36.6747C48.6283 36.7139 48.6586 36.7441 48.6793 36.7649L48.7032 36.7889L48.7097 36.7955L48.7115 36.7974C48.7117 36.7976 48.7125 36.7984 48 37.5L48.7125 36.7984C49.1 37.1919 49.0951 37.825 48.7016 38.2125C48.3082 38.6 47.6751 38.5952 47.2876 38.2018C47.2876 38.2018 47.2876 38.2018 47.2876 38.2018L47.2866 38.2008L47.2821 38.1962L47.2623 38.1763C47.2443 38.1583 47.2169 38.1308 47.1804 38.0946C47.1073 38.0222 46.998 37.9145 46.8551 37.7764C46.5693 37.5001 46.1498 37.1021 45.6195 36.6196C44.5582 35.654 43.0573 34.3543 41.2996 33.0175C37.7425 30.3119 33.2905 27.5776 29.3522 26.989C26.0932 26.502 22.9403 27.5301 19.8794 28.6656C19.6403 28.7543 19.4009 28.844 19.1618 28.9336C17.9053 29.4041 16.6539 29.8728 15.4761 30.1915C14.0714 30.5715 12.641 30.778 11.2831 30.4762C9.97727 30.186 8.66622 29.4805 7.46896 28.6497C6.26119 27.8117 5.10915 26.8037 4.11706 25.8436C3.12279 24.8814 2.27497 23.9535 1.67601 23.2667C1.3761 22.9228 1.13754 22.6381 0.973056 22.4383C0.890792 22.3384 0.82699 22.2596 0.783242 22.2051L0.732837 22.1421L0.719273 22.125L0.715465 22.1201L0.714312 22.1187C0.714171 22.1185 0.713663 22.1178 1.49998 21.5L0.713663 22.1178C0.37245 21.6836 0.447888 21.0549 0.88216 20.7137C1.31638 20.3725 1.94506 20.4481 2.2863 20.8822Z' fill='%235B81B4'/%3E%3Cpath d='M2 43.5C2 43.5 9 33 17 32.5C25 32 28.0355 35.8434 32.5 35.5C36.9645 35.1566 36.5 29 38.5 22.5C40.5 16 49.5 14 49.5 14' stroke='%233D5575' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#lineStep+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.5 10.5C0.5 9.94772 0.947715 9.5 1.5 9.5H18.5C19.0523 9.5 19.5 9.94772 19.5 10.5V15H35.5C36.0523 15 36.5 15.4477 36.5 16V32H49C49.5523 32 50 32.4477 50 33C50 33.5523 49.5523 34 49 34H35.5C34.9477 34 34.5 33.5523 34.5 33V17H18.5C17.9477 17 17.5 16.5523 17.5 16V11.5H1.5C0.947715 11.5 0.5 11.0523 0.5 10.5Z' fill='%23B3D1EC'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 22.5C1 21.9477 1.44772 21.5 2 21.5H18.5C19.0523 21.5 19.5 21.9477 19.5 22.5V28.5H35.5C36.0523 28.5 36.5 28.9477 36.5 29.5V41H49C49.5523 41 50 41.4477 50 42C50 42.5523 49.5523 43 49 43H35.5C34.9477 43 34.5 42.5523 34.5 42V30.5H18.5C17.9477 30.5 17.5 30.0523 17.5 29.5V23.5H2C1.44772 23.5 1 23.0523 1 22.5Z' fill='%235B81B4'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M34.5 12.5C34.5 11.9477 34.9477 11.5 35.5 11.5H48.5C49.0523 11.5 49.5 11.9477 49.5 12.5C49.5 13.0523 49.0523 13.5 48.5 13.5H36.5V36.5C36.5 37.0523 36.0523 37.5 35.5 37.5H19.5V42.5C19.5 43.0523 19.0523 43.5 18.5 43.5H1.5C0.947715 43.5 0.5 43.0523 0.5 42.5C0.5 41.9477 0.947715 41.5 1.5 41.5H17.5V36.5C17.5 35.9477 17.9477 35.5 18.5 35.5H34.5V12.5Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#pie+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='49' height='49' viewBox='0 0 49 49' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M49 24.5C49 38.031 38.031 49 24.5 49C10.969 49 0 38.031 0 24.5C0 10.969 10.969 -7.62939e-06 24.5 -7.62939e-06C38.031 -7.62939e-06 49 10.969 49 24.5Z' fill='%23B3D1EC'/%3E%3Cpath d='M24.5001 -7.62939e-06C18.4895 -7.70107e-06 12.6887 2.20944 8.20121 6.20799C3.71368 10.2065 0.852576 15.7152 0.162208 21.6859C-0.528161 27.6567 1.00038 33.6729 4.45703 38.59C7.91368 43.5071 13.0572 46.9819 18.9092 48.3535L24.5001 24.5V-7.62939e-06Z' fill='%235B81B4'/%3E%3Cpath d='M24.5 -7.62939e-06C21.2826 -7.66776e-06 18.0968 0.633704 15.1243 1.86494C12.1518 3.09618 9.45094 4.90084 7.1759 7.17588L24.5 24.5V-7.62939e-06Z' fill='%233D5575'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#doughnut+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='49' height='49' viewBox='0 0 49 49' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M49 24.5C49 38.031 38.031 49 24.5 49C10.969 49 0 38.031 0 24.5C0 10.969 10.969 1.52588e-05 24.5 1.52588e-05C38.031 1.52588e-05 49 10.969 49 24.5ZM12.9042 24.5C12.9042 30.9042 18.0958 36.0959 24.5 36.0959C30.9042 36.0959 36.0958 30.9042 36.0958 24.5C36.0958 18.0958 30.9042 12.9042 24.5 12.9042C18.0958 12.9042 12.9042 18.0958 12.9042 24.5Z' fill='%23B3D1EC'/%3E%3Cpath d='M24.5001 1.52588e-05C18.4895 1.51871e-05 12.6887 2.20946 8.20121 6.20801C3.71368 10.2066 0.852576 15.7152 0.162208 21.6859C-0.528161 27.6567 1.00038 33.6729 4.45703 38.59C7.91368 43.5071 13.0572 46.982 18.9092 48.3536L21.8537 35.7907C19.0838 35.1414 16.6492 33.4967 15.0131 31.1692C13.3769 28.8418 12.6534 25.9942 12.9802 23.168C13.3069 20.3419 14.6612 17.7345 16.7853 15.8418C18.9094 13.9492 21.6551 12.9034 24.5001 12.9034V1.52588e-05Z' fill='%235B81B4'/%3E%3Cpath d='M24.5 1.52588e-05C21.2826 1.52204e-05 18.0968 0.633726 15.1243 1.86497C12.1518 3.09621 9.45094 4.90086 7.1759 7.1759L16.3005 16.3005C17.3773 15.2237 18.6556 14.3696 20.0625 13.7868C21.4694 13.2041 22.9772 12.9042 24.5 12.9042V1.52588e-05Z' fill='%233D5575'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#area+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35.6196 18H15.3804L1 9.00001V51H50V31.5L35.6196 18Z' fill='%23B3D1EC' fill-opacity='0.7'/%3E%3Cpath d='M11.5376 29.1404L1 21V50H50V37.2807L30.5054 25.579L11.5376 29.1404Z' fill='%235B81B4' fill-opacity='0.7'/%3E%3Cpath d='M50 15L37.4894 23.6197L30.7128 36.8028L16.117 33.7606L1 44.4085V51H50V15Z' fill='%233D5575' fill-opacity='0.7'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 1.00001C0.249996 0.585798 0.585781 0.250009 0.999996 0.250009C1.41421 0.250009 1.75 0.585798 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#areaStacked+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.5 19.5H1V51H50L50 16L35.5 10.5L14.5 19.5Z' fill='%23B3D1EC'/%3E%3Cpath d='M14.5 29L1 26.2326V51H50L50 22.5L34 21L14.5 29Z' fill='%235B81B4'/%3E%3Cpath d='M14.5 41L1 36.8472V51H50L50 26L35.5 35.5L14.5 41Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 1.00001C0.249996 0.585802 0.585781 0.250013 0.999996 0.250013C1.41421 0.250013 1.75 0.585802 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#areaStacked100+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.99998H50V51H1V1.99998Z' fill='%23B3D1EC'/%3E%3Cpath d='M24.5 20.4534L1 18.5V51H50L50 7.99998L24.5 20.4534Z' fill='%235B81B4'/%3E%3Cpath d='M50 30L25.5 37L1 30V51H50L50 30Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 0.999986C0.249996 0.585775 0.585781 0.249986 0.999996 0.249986C1.41421 0.249986 1.75 0.585775 1.75 0.999986L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#combination1+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.7391 24.5L34.3913 10L49 11.5V51H1V31.5L18.7391 24.5Z' fill='%23B3D1EC'/%3E%3Cpath d='M13 32C13 30.8954 13.8954 30 15 30H21C22.1046 30 23 30.8954 23 32V51H13V32Z' fill='%235B81B4'/%3E%3Cpath d='M30 21C30 19.8954 30.8954 19 32 19H38C39.1046 19 40 19.8954 40 21V51H30V21Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M35.1147 9.00661C34.8389 8.97479 34.5623 9.05904 34.3511 9.23919L17.4637 23.6432L1.59921 30.5839C1.09323 30.8052 0.862501 31.3949 1.08387 31.9008C1.30523 32.4068 1.89487 32.6375 2.40084 32.4162L18.4008 25.4162C18.4907 25.3769 18.5743 25.3245 18.649 25.2609L35.3178 11.0433L47.8854 12.4934C48.434 12.5567 48.9301 12.1633 48.9934 11.6146C49.0567 11.066 48.6633 10.5699 48.1147 10.5066L35.1147 9.00661Z' fill='%235B81B4'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 1.00001C0.249996 0.585802 0.585781 0.250013 0.999996 0.250013C1.41421 0.250013 1.75 0.585802 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  +"div#tab1Con input[type=radio]#combination2+img{"
  +"content: url(\"data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13 26C13 24.8954 13.8954 24 15 24H21C22.1046 24 23 24.8954 23 26V51H13V26Z' fill='%23B3D1EC'/%3E%3Cpath d='M30 12C30 10.8954 30.8954 10 32 10H38C39.1046 10 40 10.8954 40 12V51H30V12Z' fill='%233D5575'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M35.359 15.0667C35.0057 14.9308 34.6059 15.006 34.3262 15.261L17.7364 30.3871L2.27072 26.0374C1.73907 25.8878 1.18685 26.1976 1.03733 26.7293C0.887797 27.2609 1.19757 27.8131 1.72923 27.9627L17.7292 32.4627C18.0616 32.5561 18.4186 32.4716 18.6737 32.239L35.2174 17.155L47.641 21.9334C48.1565 22.1316 48.7351 21.8745 48.9333 21.359C49.1316 20.8435 48.8744 20.2649 48.359 20.0667L35.359 15.0667Z' fill='%235B81B4'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.249998 51L0.249996 1.00001C0.249996 0.585802 0.585781 0.250013 0.999996 0.250013C1.41421 0.250013 1.75 0.585802 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z' fill='%23999999'/%3E%3C/svg%3E%0A\");"
  +"}"
  */
  +"svg.chartImg{"
  +"cursor: pointer;opacity:0.4;"
  +"}"
  +"input:checked+svg.chartImg, div#tab1Con ul label:hover svg.chartImg{"
  +"opacity:1;"
  +"}"
  +"svg.chartImg path{"
  +"transition:fill 0.4s ease-in-out, stroke 0.4s ease-in-out;"
  +"}"
  +"input[type=radio]:checked+svg path:nth-child(-n+3), div#tab1Con ul label:hover svg path:nth-child(-n+3){"
  +"fill: var(--chart-color-1);"
  +"}"
  +"input[type=radio]:checked+svg path:nth-child(n+4):nth-child(-n+6), div#tab1Con ul label:hover svg path:nth-child(n+4):nth-child(-n+6){"
  +"fill: var(--chart-color-2);"
  +"}"
  +"input[type=radio]:checked+svg path:nth-child(n+7):nth-child(-n+9), div#tab1Con ul label:hover svg path:nth-child(n+7):nth-child(-n+9){"
  +"fill: var(--chart-color-3);"
  +"}"
  +"input#spline[type=radio]:checked+svg path:nth-child(n+7):nth-child(-n+9), div#tab1Con ul label:hover input#spline+svg path:nth-child(n+7):nth-child(-n+9){"
  +"fill:none !important;stroke: var(--chart-color-3);"
  +"}"
  +"input#combination1[type=radio]:checked+svg path:nth-child(1), div#tab1Con ul label:hover input#combination1+svg path:nth-child(1){"
  +"fill: var(--chart-color-1);"
  +"}"
  +"input#combination1[type=radio]:checked+svg path:nth-child(2), div#tab1Con ul label:hover input#combination1+svg path:nth-child(2){"
  +"fill: var(--chart-color-2);"
  +"}"
  +"input#combination1[type=radio]:checked+svg path:nth-child(3), div#tab1Con ul label:hover input#combination1+svg path:nth-child(3){"
  +"fill: var(--chart-color-3);"
  +"}"
  +"input#combination1[type=radio]:checked+svg path:nth-child(4), div#tab1Con ul label:hover input#combination1+svg path:nth-child(4){"
  +"fill: var(--chart-color-4);"
  +"}"
  +"input[type=radio]:checked+svg path:last-child, div#tab1Con ul label:hover input+svg path:last-child{"
  +"fill: var(--chart-primary-" + classPrefix + ");"
  +"}"
  +"input#combination1[type=radio]:checked+svg path:last-child, div#tab1Con ul label:hover input#combination1+svg path:last-child{"
  +"fill: var(--chart-primary-" + classPrefix + ");"
  +"}"
  +":root{"
  +"--chart-color-1: "+ _chartColorsArray[0][0] +";"
  +"--chart-color-2: "+ _chartColorsArray[0][1] +";"
  +"--chart-color-3: "+ _chartColorsArray[0][2] +";"
  +"--chart-color-4: "+ _chartColorsArray[0][4] +";"
  +"--chart-primary-" + this.Style + ": " + _ibThemePrimary[this.Style] + ";"
  +"}"
  +".highcharts-background{"
  +"stroke-width: 0;"
  +"}"

  document.body.appendChild(styles);
  document.documentElement.style.setProperty('--chart-color-1', _chartColorsArray[0][0]);
  document.documentElement.style.setProperty('--chart-color-2', _chartColorsArray[0][1]);
  document.documentElement.style.setProperty('--chart-color-3', _chartColorsArray[0][2]);
  var _chartSvgs = {
    column: '<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M6 32C6 30.8954 6.89543 30 8 30H14C15.1046 30 16 30.8954 16 32V51H6V32Z" fill="#dbdddf"/><path /><path /><path d="M21 21C21 19.8954 21.8954 19 23 19H29C30.1046 19 31 19.8954 31 21V51H21V21Z" fill="#afb2b7"/><path /><path /><path d="M36 9C36 7.89543 36.8954 7 38 7H44C45.1046 7 46 7.89543 46 9V51H36V9Z" fill="#7b7c7f"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    columnStacked:'<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M6 32C6 30.8954 6.89543 30 8 30H14C15.1046 30 16 30.8954 16 32V51H6V32Z" fill="#dbdddf"/><path d="M21 21C21 19.8954 21.8954 19 23 19H29C30.1046 19 31 19.8954 31 21V51H21V21Z" fill="#dbdddf"/><path d="M36 9C36 7.89543 36.8954 7 38 7H44C45.1046 7 46 7.89543 46 9V51H36V9Z" fill="#dbdddf"/><path d="M6 32C6 30.8954 6.89543 30 8 30H14C15.1046 30 16 30.8954 16 32V44H6V32Z" fill="#afb2b7"/><path d="M21 21C21 19.8954 21.8954 19 23 19H29C30.1046 19 31 19.8954 31 21V38H21V21Z" fill="#afb2b7"/><path d="M36 9C36 7.89543 36.8954 7 38 7H44C45.1046 7 46 7.89543 46 9V34H36V9Z" fill="#afb2b7"/><path d="M6 32C6 30.8954 6.89543 30 8 30H14C15.1046 30 16 30.8954 16 32V36H6V32Z" fill="#7b7c7f"/><path d="M21 21C21 19.8954 21.8954 19 23 19H29C30.1046 19 31 19.8954 31 21V26H21V21Z" fill="#7b7c7f"/><path d="M36 9C36 7.89543 36.8954 7 38 7H44C45.1046 7 46 7.89543 46 9V17H36V9Z" fill="#7b7c7f"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    columnStacked100: '<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M6 9.00002C6 7.89545 6.89543 7.00002 8 7.00002H14C15.1046 7.00002 16 7.89545 16 9.00002V51H6V9.00002Z" fill="#dbdddf"/><path d="M21 9.00002C21 7.89545 21.8954 7.00002 23 7.00002H29C30.1046 7.00002 31 7.89545 31 9.00002V51H21V9.00002Z" fill="#dbdddf"/><path d="M36 9.00001C36 7.89544 36.8954 7.00001 38 7.00001H44C45.1046 7.00001 46 7.89544 46 9.00001V51H36V9.00001Z" fill="#dbdddf"/><path d="M6 9.00002C6 7.89545 6.89543 7.00002 8 7.00002H14C15.1046 7.00002 16 7.89545 16 9.00002V38H6V9.00002Z" fill="#afb2b7"/><path d="M21 9.00002C21 7.89545 21.8954 7.00002 23 7.00002H29C30.1046 7.00002 31 7.89545 31 9.00002V32H21V9.00002Z" fill="#afb2b7"/><path d="M36 9.00001C36 7.89544 36.8954 7.00001 38 7.00001H44C45.1046 7.00001 46 7.89544 46 9.00001V28H36V9.00001Z" fill="#afb2b7"/><path d="M6 9.00002C6 7.89545 6.89543 7.00002 8 7.00002H14C15.1046 7.00002 16 7.89545 16 9.00002V21H6V9.00002Z" fill="#7b7c7f"/><path d="M21 9.00002C21 7.89545 21.8954 7.00002 23 7.00002H29C30.1046 7.00002 31 7.89545 31 9.00002V17H21V9.00002Z" fill="#7b7c7f"/><path d="M36 9.00001C36 7.89544 36.8954 7.00001 38 7.00001H44C45.1046 7.00001 46 7.89544 46 9.00001V14H36V9.00001Z" fill="#7b7c7f"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 1.00001C0.249996 0.585794 0.585781 0.250005 0.999996 0.250005C1.41421 0.250005 1.75 0.585794 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    bar: '<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M20 6C21.1046 6 22 6.89543 22 8L22 14C22 15.1046 21.1046 16 20 16L1 16L1 6L20 6Z" fill="#dbdddf"/><path /><path /><path d="M31 21C32.1046 21 33 21.8954 33 23L33 29C33 30.1046 32.1046 31 31 31L1 31L1 21L31 21Z" fill="#afb2b7"/><path /><path /><path d="M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L1 46L1 36L43 36Z" fill="#7b7c7f"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    barStacked:'<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M20 6C21.1046 6 22 6.89543 22 8L22 14C22 15.1046 21.1046 16 20 16L1 16L1 6L20 6Z" fill="#dbdddf"/><path d="M31 21C32.1046 21 33 21.8954 33 23L33 29C33 30.1046 32.1046 31 31 31L1 31L1 21L31 21Z" fill="#dbdddf"/><path d="M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L1 46L1 36L43 36Z" fill="#dbdddf"/><path d="M20 6C21.1046 6 22 6.89543 22 8L22 14C22 15.1046 21.1046 16 20 16L8 16L8 6L20 6Z" fill="#afb2b7"/><path d="M31 21C32.1046 21 33 21.8954 33 23L33 29C33 30.1046 32.1046 31 31 31L14 31L14 21L31 21Z" fill="#afb2b7"/><path d="M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L18 46L18 36L43 36Z" fill="#afb2b7"/><path d="M20 6C21.1046 6 22 6.89543 22 8L22 14C22 15.1046 21.1046 16 20 16L16 16L16 6L20 6Z" fill="#7b7c7f"/><path d="M31 21C32.1046 21 33 21.8954 33 23L33 29C33 30.1046 32.1046 31 31 31L26 31L26 21L31 21Z" fill="#7b7c7f"/><path d="M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L35 46L35 36L43 36Z" fill="#7b7c7f"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 1C0.249996 0.58579 0.585781 0.250002 0.999996 0.250002C1.41421 0.250002 1.75 0.58579 1.75 1L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    barStacked100: '<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M43 6C44.1046 6 45 6.89543 45 8L45 14C45 15.1046 44.1046 16 43 16L1 16L1 6L43 6Z" fill="#dbdddf"/><path d="M43 21C44.1046 21 45 21.8954 45 23L45 29C45 30.1046 44.1046 31 43 31L1 31L1 21L43 21Z" fill="#dbdddf"/><path d="M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L1 46L1 36L43 36Z" fill="#dbdddf"/><path d="M43 6C44.1046 6 45 6.89543 45 8L45 14C45 15.1046 44.1046 16 43 16L14 16L14 6L43 6Z" fill="#afb2b7"/><path d="M43 21C44.1046 21 45 21.8954 45 23L45 29C45 30.1046 44.1046 31 43 31L20 31L20 21L43 21Z" fill="#afb2b7"/><path d="M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L24 46L24 36L43 36Z" fill="#afb2b7"/><path d="M43 6C44.1046 6 45 6.89543 45 8L45 14C45 15.1046 44.1046 16 43 16L31 16L31 6L43 6Z" fill="#7b7c7f"/><path d="M43 21C44.1046 21 45 21.8954 45 23L45 29C45 30.1046 44.1046 31 43 31L35 31L35 21L43 21Z" fill="#7b7c7f"/><path d="M43 36C44.1046 36 45 36.8954 45 38L45 44C45 45.1046 44.1046 46 43 46L38 46L38 36L43 36Z" fill="#7b7c7f"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 1C0.249996 0.58579 0.585781 0.250002 0.999996 0.250002C1.41421 0.250002 1.75 0.58579 1.75 1L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    line:'<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.16793 7.94531C1.47429 7.48579 2.09516 7.36161 2.55468 7.66796L15.8028 16.5H34.5C34.7652 16.5 35.0196 16.6054 35.2071 16.7929L48.7071 30.2929C49.0976 30.6834 49.0976 31.3166 48.7071 31.7071C48.3166 32.0976 47.6834 32.0976 47.2929 31.7071L34.0858 18.5H15.5C15.3026 18.5 15.1096 18.4416 14.9453 18.3321L1.44528 9.33206C0.985755 9.02571 0.861582 8.40484 1.16793 7.94531Z" fill="#dbdddf"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.719107 20.8753C1.06412 20.444 1.69341 20.3741 2.12467 20.7191L11.7633 28.4301L29.3091 25.0184C29.5568 24.9702 29.8136 25.0175 30.0279 25.1507L48.5279 36.6507C48.997 36.9423 49.1408 37.5589 48.8493 38.0279C48.5577 38.497 47.9411 38.6409 47.472 38.3493L29.3055 27.0566L11.6908 30.4816C11.4027 30.5377 11.1045 30.4642 10.8753 30.2809L0.875281 22.2809C0.444019 21.9359 0.374097 21.3066 0.719107 20.8753Z" fill="#afb2b7"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M49.816 14.422C50.1353 14.8727 50.0287 15.4968 49.578 15.816L37.7824 24.1712L31.3944 36.9472C31.1905 37.3551 30.7364 37.5733 30.2905 37.4778L16.7259 34.5711L2.58652 44.8099C2.1392 45.1339 1.51399 45.0338 1.19007 44.5865C0.866149 44.1392 0.966183 43.514 1.4135 43.19L15.9135 32.69C16.1431 32.5238 16.4324 32.4628 16.7095 32.5222L29.952 35.3599L36.1056 23.0528C36.1791 22.9057 36.2878 22.779 36.422 22.684L48.422 14.184C48.8727 13.8647 49.4968 13.9713 49.816 14.422Z" fill="#7b7c7f"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    spline:'<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.27074 7.81574C1.64861 7.41303 2.28139 7.39286 2.68414 7.77067L2.68818 7.77446L2.70284 7.78812L2.76348 7.84428C2.81756 7.89416 2.89855 7.96842 3.00428 8.06413C3.21578 8.25559 3.52606 8.53267 3.91771 8.87195C4.70155 9.55098 5.80853 10.4767 7.09976 11.4626C9.70838 13.4544 12.9718 15.6155 15.8125 16.5501C18.9736 17.5901 21.6979 17.0069 24.6675 16.3711C24.7323 16.3573 24.7972 16.3434 24.8623 16.3295C27.8736 15.6856 31.1398 15.0302 34.8817 16.5757C38.569 18.0988 42.076 21.6427 44.6027 24.6776C45.8821 26.2143 46.9409 27.6588 47.68 28.719C48.0499 29.2496 48.3405 29.6851 48.5394 29.9893C48.6389 30.1414 48.7156 30.2608 48.7678 30.3429C48.7797 30.3616 48.7903 30.3783 48.7997 30.3931C48.8108 30.4108 48.8202 30.4256 48.8276 30.4375L48.8435 30.4628L48.8491 30.4718C48.8492 30.472 48.8497 30.4729 48 31L48.8497 30.4729C49.1409 30.9422 48.9964 31.5586 48.5271 31.8498C48.0579 32.1409 47.4415 31.9965 47.1503 31.5273C47.1503 31.5273 47.1503 31.5273 47.1503 31.5273M47.1503 31.5273L47.1497 31.5264L47.1468 31.5217L47.134 31.5012C47.1223 31.4826 47.1043 31.4541 47.0804 31.4165C47.0324 31.3411 46.9603 31.2288 46.8657 31.084C46.6763 30.7945 46.3967 30.3754 46.0393 29.8628C45.3239 28.8365 44.2998 27.4396 43.0656 25.9572C40.5651 22.9537 37.3221 19.7476 34.1182 18.4243C31.0021 17.1372 28.2925 17.6412 25.2804 18.2853C25.1751 18.3078 25.0694 18.3305 24.9632 18.3533C22.0688 18.9749 18.8706 19.6617 15.1874 18.4499C12.0093 17.4043 8.5227 15.0654 5.88604 13.0522C4.55462 12.0356 3.41514 11.0827 2.60818 10.3836C2.20443 10.0339 1.88322 9.74705 1.66209 9.54687C1.5515 9.44677 1.46589 9.36828 1.40744 9.31437L1.3404 9.25228L1.32266 9.23574L1.31643 9.22991C1.31628 9.22977 1.31571 9.22924 1.99997 8.5L1.31643 9.22991C0.91368 8.852 0.89283 8.21849 1.27074 7.81574" fill="#dbdddf"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M2.2863 20.8822C2.28634 20.8822 2.28626 20.8821 2.2863 20.8822L2.2887 20.8852L2.29896 20.8982L2.34245 20.9526C2.38147 21.0012 2.44023 21.0737 2.51714 21.1672C2.67102 21.3541 2.8973 21.6241 3.18333 21.9521C3.75624 22.6091 4.56467 23.4936 5.5079 24.4064C6.45331 25.3213 7.52002 26.2508 8.60913 27.0066C9.70874 27.7695 10.7727 28.314 11.7169 28.5238C12.609 28.7221 13.6683 28.6087 14.9538 28.2609C16.0322 27.9691 17.1782 27.5402 18.4364 27.0694C18.6812 26.9778 18.9302 26.8846 19.1838 26.7905C22.2273 25.6614 25.8244 24.4396 29.6478 25.011C34.1228 25.6798 38.9209 28.6955 42.5104 31.4256C44.326 32.8066 45.8727 34.1461 46.9654 35.1403C47.5122 35.6377 47.9465 36.0497 48.2452 36.3385C48.3946 36.4829 48.5101 36.5966 48.5889 36.6747C48.6283 36.7139 48.6586 36.7441 48.6793 36.7649L48.7032 36.7889L48.7097 36.7955L48.7115 36.7974C48.7117 36.7976 48.7125 36.7984 48 37.5L48.7125 36.7984C49.1 37.1919 49.0951 37.825 48.7016 38.2125C48.3082 38.6 47.6751 38.5952 47.2876 38.2018C47.2876 38.2018 47.2876 38.2018 47.2876 38.2018L47.2866 38.2008L47.2821 38.1962L47.2623 38.1763C47.2443 38.1583 47.2169 38.1308 47.1804 38.0946C47.1073 38.0222 46.998 37.9145 46.8551 37.7764C46.5693 37.5001 46.1498 37.1021 45.6195 36.6196C44.5582 35.654 43.0573 34.3543 41.2996 33.0175C37.7425 30.3119 33.2905 27.5776 29.3522 26.989C26.0932 26.502 22.9403 27.5301 19.8794 28.6656C19.6403 28.7543 19.4009 28.844 19.1618 28.9336C17.9053 29.4041 16.6539 29.8728 15.4761 30.1915C14.0714 30.5715 12.641 30.778 11.2831 30.4762C9.97727 30.186 8.66622 29.4805 7.46896 28.6497C6.26119 27.8117 5.10915 26.8037 4.11706 25.8436C3.12279 24.8814 2.27497 23.9535 1.67601 23.2667C1.3761 22.9228 1.13754 22.6381 0.973056 22.4383C0.890792 22.3384 0.82699 22.2596 0.783242 22.2051L0.732837 22.1421L0.719273 22.125L0.715465 22.1201L0.714312 22.1187C0.714171 22.1185 0.713663 22.1178 1.49998 21.5L0.713663 22.1178C0.37245 21.6836 0.447888 21.0549 0.88216 20.7137C1.31638 20.3725 1.94506 20.4481 2.2863 20.8822Z" fill="#afb2b7"/><path /><path /><path d="M2 43.5C2 43.5 9 33 17 32.5C25 32 28.0355 35.8434 32.5 35.5C36.9645 35.1566 36.5 29 38.5 22.5C40.5 16 49.5 14 49.5 14" stroke="#7b7c7f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    lineStep:'<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 10.5C0.5 9.94772 0.947715 9.5 1.5 9.5H18.5C19.0523 9.5 19.5 9.94772 19.5 10.5V15H35.5C36.0523 15 36.5 15.4477 36.5 16V32H49C49.5523 32 50 32.4477 50 33C50 33.5523 49.5523 34 49 34H35.5C34.9477 34 34.5 33.5523 34.5 33V17H18.5C17.9477 17 17.5 16.5523 17.5 16V11.5H1.5C0.947715 11.5 0.5 11.0523 0.5 10.5Z" fill="#dbdddf"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M1 22.5C1 21.9477 1.44772 21.5 2 21.5H18.5C19.0523 21.5 19.5 21.9477 19.5 22.5V28.5H35.5C36.0523 28.5 36.5 28.9477 36.5 29.5V41H49C49.5523 41 50 41.4477 50 42C50 42.5523 49.5523 43 49 43H35.5C34.9477 43 34.5 42.5523 34.5 42V30.5H18.5C17.9477 30.5 17.5 30.0523 17.5 29.5V23.5H2C1.44772 23.5 1 23.0523 1 22.5Z" fill="#afb2b7"/><path fill-rule="evenodd" clip-rule="evenodd" d="M34.5 12.5C34.5 11.9477 34.9477 11.5 35.5 11.5H48.5C49.0523 11.5 49.5 11.9477 49.5 12.5C49.5 13.0523 49.0523 13.5 48.5 13.5H36.5V36.5C36.5 37.0523 36.0523 37.5 35.5 37.5H19.5V42.5C19.5 43.0523 19.0523 43.5 18.5 43.5H1.5C0.947715 43.5 0.5 43.0523 0.5 42.5C0.5 41.9477 0.947715 41.5 1.5 41.5H17.5V36.5C17.5 35.9477 17.9477 35.5 18.5 35.5H34.5V12.5Z" fill="#7b7c7f"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 0.999998C0.249996 0.585786 0.585781 0.249998 0.999996 0.249998C1.41421 0.249998 1.75 0.585786 1.75 0.999998L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    pie:'<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49" fill="none"><path d="M49 24.5C49 38.031 38.031 49 24.5 49C10.969 49 0 38.031 0 24.5C0 10.969 10.969 -7.62939e-06 24.5 -7.62939e-06C38.031 -7.62939e-06 49 10.969 49 24.5Z" fill="#dbdddf"/><path /><path /><path d="M24.5001 -7.62939e-06C18.4895 -7.70107e-06 12.6887 2.20944 8.20121 6.20799C3.71368 10.2065 0.852576 15.7152 0.162208 21.6859C-0.528161 27.6567 1.00038 33.6729 4.45703 38.59C7.91368 43.5071 13.0572 46.9819 18.9092 48.3535L24.5001 24.5V-7.62939e-06Z" fill="#afb2b7"/><path /><path /><path d="M24.5 -7.62939e-06C21.2826 -7.66776e-06 18.0968 0.633704 15.1243 1.86494C12.1518 3.09618 9.45094 4.90084 7.1759 7.17588L24.5 24.5V-7.62939e-06Z" fill="#7b7c7f"/></svg>',
    doughnut: '<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49" fill="none"><path d="M49 24.5C49 38.031 38.031 49 24.5 49C10.969 49 0 38.031 0 24.5C0 10.969 10.969 1.52588e-05 24.5 1.52588e-05C38.031 1.52588e-05 49 10.969 49 24.5ZM12.9042 24.5C12.9042 30.9042 18.0958 36.0959 24.5 36.0959C30.9042 36.0959 36.0958 30.9042 36.0958 24.5C36.0958 18.0958 30.9042 12.9042 24.5 12.9042C18.0958 12.9042 12.9042 18.0958 12.9042 24.5Z" fill="#dbdddf"/><path /><path /><path d="M24.5001 1.52588e-05C18.4895 1.51871e-05 12.6887 2.20946 8.20121 6.20801C3.71368 10.2066 0.852576 15.7152 0.162208 21.6859C-0.528161 27.6567 1.00038 33.6729 4.45703 38.59C7.91368 43.5071 13.0572 46.982 18.9092 48.3536L21.8537 35.7907C19.0838 35.1414 16.6492 33.4967 15.0131 31.1692C13.3769 28.8418 12.6534 25.9942 12.9802 23.168C13.3069 20.3419 14.6612 17.7345 16.7853 15.8418C18.9094 13.9492 21.6551 12.9034 24.5001 12.9034V1.52588e-05Z" fill="#afb2b7"/><path /><path /><path d="M24.5 1.52588e-05C21.2826 1.52204e-05 18.0968 0.633726 15.1243 1.86497C12.1518 3.09621 9.45094 4.90086 7.1759 7.1759L16.3005 16.3005C17.3773 15.2237 18.6556 14.3696 20.0625 13.7868C21.4694 13.2041 22.9772 12.9042 24.5 12.9042V1.52588e-05Z" fill="#7b7c7f"/></svg>',
    area: '<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M35.6196 18H15.3804L1 9.00001V51H50V31.5L35.6196 18Z" fill="#dbdddf" fill-opacity="0.7"/><path /><path /><path d="M11.5376 29.1404L1 21V50H50V37.2807L30.5054 25.579L11.5376 29.1404Z" fill="#afb2b7" fill-opacity="0.7"/><path /><path /><path d="M50 15L37.4894 23.6197L30.7128 36.8028L16.117 33.7606L1 44.4085V51H50V15Z" fill="#7b7c7f" fill-opacity="0.7"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 1.00001C0.249996 0.585798 0.585781 0.250009 0.999996 0.250009C1.41421 0.250009 1.75 0.585798 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    areaStacked: '<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M14.5 19.5H1V51H50L50 16L35.5 10.5L14.5 19.5Z" fill="#dbdddf"/><path /><path /><path d="M14.5 29L1 26.2326V51H50L50 22.5L34 21L14.5 29Z" fill="#afb2b7"/><path /><path /><path d="M14.5 41L1 36.8472V51H50L50 26L35.5 35.5L14.5 41Z" fill="#7b7c7f"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 1.00001C0.249996 0.585802 0.585781 0.250013 0.999996 0.250013C1.41421 0.250013 1.75 0.585802 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    areaStacked100: '<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M1 1.99998H50V51H1V1.99998Z" fill="#dbdddf"/><path /><path /><path d="M24.5 20.4534L1 18.5V51H50L50 7.99998L24.5 20.4534Z" fill="#afb2b7"/><path /><path /><path d="M50 30L25.5 37L1 30V51H50L50 30Z" fill="#7b7c7f"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 0.999986C0.249996 0.585775 0.585781 0.249986 0.999996 0.249986C1.41421 0.249986 1.75 0.585775 1.75 0.999986L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    combination1:'<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M18.7391 24.5L34.3913 10L49 11.5V51H1V31.5L18.7391 24.5Z" fill="#dbdddf"/><path d="M13 32C13 30.8954 13.8954 30 15 30H21C22.1046 30 23 30.8954 23 32V51H13V32Z" fill="#afb2b7"/><path d="M30 21C30 19.8954 30.8954 19 32 19H38C39.1046 19 40 19.8954 40 21V51H30V21Z" fill="#7b7c7f"/><path fill-rule="evenodd" clip-rule="evenodd" d="M35.1147 9.00661C34.8389 8.97479 34.5623 9.05904 34.3511 9.23919L17.4637 23.6432L1.59921 30.5839C1.09323 30.8052 0.862501 31.3949 1.08387 31.9008C1.30523 32.4068 1.89487 32.6375 2.40084 32.4162L18.4008 25.4162C18.4907 25.3769 18.5743 25.3245 18.649 25.2609L35.3178 11.0433L47.8854 12.4934C48.434 12.5567 48.9301 12.1633 48.9934 11.6146C49.0567 11.066 48.6633 10.5699 48.1147 10.5066L35.1147 9.00661Z" fill="#afb2b7"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 1.00001C0.249996 0.585802 0.585781 0.250013 0.999996 0.250013C1.41421 0.250013 1.75 0.585802 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>',
    combination2:'<svg class="chartImg" xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M13 26C13 24.8954 13.8954 24 15 24H21C22.1046 24 23 24.8954 23 26V51H13V26Z" fill="#dbdddf"/><path /><path /><path d="M30 12C30 10.8954 30.8954 10 32 10H38C39.1046 10 40 10.8954 40 12V51H30V12Z" fill="#7b7c7f"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M35.359 15.0667C35.0057 14.9308 34.6059 15.006 34.3262 15.261L17.7364 30.3871L2.27072 26.0374C1.73907 25.8878 1.18685 26.1976 1.03733 26.7293C0.887797 27.2609 1.19757 27.8131 1.72923 27.9627L17.7292 32.4627C18.0616 32.5561 18.4186 32.4716 18.6737 32.239L35.2174 17.155L47.641 21.9334C48.1565 22.1316 48.7351 21.8745 48.9333 21.359C49.1316 20.8435 48.8744 20.2649 48.359 20.0667L35.359 15.0667Z" fill="#afb2b7"/><path /><path /><path fill-rule="evenodd" clip-rule="evenodd" d="M0.249998 51L0.249996 1.00001C0.249996 0.585802 0.585781 0.250013 0.999996 0.250013C1.41421 0.250013 1.75 0.585802 1.75 1.00001L1.75 50.25L51 50.25C51.4142 50.25 51.75 50.5858 51.75 51C51.75 51.4142 51.4142 51.75 51 51.75L0.999998 51.75C0.585783 51.75 0.249998 51.4142 0.249998 51Z" fill="#999999"/></svg>'
  }

  /** 
   * 기본 다이얼로그 생성
  1. 차트 유형 선택
  2. 데이터 영역 선택
  3. 기타 범례 타이틀 위치, 색상 테마 선택 등 
  **/
  var charts = [
    {"Name":"선형차트", Menu:1, Items: [
      {"Name":"일반차트","Value":"line"},
      {"Name":"부드러운 꺽은선 차트","Value":"spline"},
      {"Name":"계단형 차트","Value":"lineStep"}
    ]},
    {"Name":"수직막대차트", Menu:1, Items: [
      {"Name":"수직막대 일반차트","Value":"column"},
      {"Name":"수직막대 누적차트","Value":"columnStacked"},
      {"Name":"수직막대 100% 누적차트","Value":"columnStacked100"}
    ]},
    {"Name":"수평막대차트", Menu:1, Items: [
      {"Name":"수평막대 일반차트","Value":"bar"},
      {"Name":"수평막대 누적차트","Value":"barStacked"},
      {"Name":"수평막대 100% 누적차트","Value":"barStacked100"}
    ]},
    {"Name":"파이차트", Menu:1, Items: [
      {"Name":"파이형 차트","Value":"pie"},
      {"Name":"도넛형 차트","Value":"doughnut"}
    ]},
    {"Name":"영역차트", Menu:1, Items: [
      {"Name":"일반영역차트","Value":"area"},
      {"Name":"누적영역차트","Value":"areaStacked"},
      {"Name":"100% 누적영역차트","Value":"areaStacked100"}
    ]},
    {"Name":"복합차트", Menu:1, Items: [
      {"Name":"세로막대+영역 차트","Value":"combination1"},
      {"Name":"세로막대+꺽은선 차트","Value":"combination2"},
    ]}
  ];

  var body = 
  "<div class='"+classPrefix+"ChartPopup'>"
      // 차트 영역
  + "  <div class='"+classPrefix+"ChartShow'>"
  + "    <div class='"+classPrefix+"ChartChart'></div>"
  + "  </div>"
      // Config 영역
  + "  <div class='"+classPrefix+"ChartConfig'>"
  + "    <ul>"
  + "      <li class='"+classPrefix+"ChartTab active' id='tab1'>"
  + "        <button  type='button' onclick=\"DLG.moveTab('tab1')\" class='active'>차트유형</button>"
        +"</li>"
        +"<li class='"+classPrefix+"ChartTab' id='tab2'>"
        +"  <button type='button' onclick=\"DLG.moveTab('tab2')\">차트데이터</button>"
        +"</li>"
        +"<li class='"+classPrefix+"ChartTab' id='tab3'>"
        +"  <button  type='button' onclick=\"DLG.moveTab('tab3')\">기타 설정</button>"
  +"      </li>"
  +"    </ul>"
  +"    <div class='"+classPrefix+"ChartTabContent'>"

  + "<div class='"+classPrefix+"ChartTabCon' id='tab1Con' style='display:block'>";
  for(var i = 0 ; i < charts.length ; i++ ) {
    body += 
    "<div class='"+classPrefix+"ChartAccItem'>"
    +"  <div class='"+classPrefix+"ChartAccHeader'>"+charts[i]['Name']+"</div>"
    +"  <div class='"+classPrefix+"ChartAccContent'>"
    +"    <ul>";
        for(var x = 0 ; x < charts[i].Items.length ; x++){
        body += 
          "<li>"
          + "<label title='"+charts[i]['Items'][x]['Name']+"' for='"+charts[i]['Items'][x]['Value']+"'>"
          + "<input type='radio' id='"+charts[i]['Items'][x]['Value']+"' name='chartType'/>"
          // + "<img title='"+charts[i]['Items'][x]['Name']+"'/>" 
          + _chartSvgs[charts[i]['Items'][x]['Value']]
          +"</label>"
          + "</li>";
        }//end for x
        body += 
    "    </ul>"
    +"  </div>"
    +"</div>"
  }//end for i
  body += "</div>"
  
  +"  <div class='"+classPrefix+"ChartTabCon' id='tab2Con'>"
  +"    <div class='"+classPrefix+"ChartAccItem'>"
  +"      <div class='"+classPrefix+"ChartAccHeader'>카테고리</div>"
  +"      <div class='"+classPrefix+"ChartAccContent categories'>"
  +"        <ul>"
  +"        </ul>"
  +"      </div>"
  +"    </div>"
  +"    <div class='"+classPrefix+"ChartAccItem'>"
  +"      <div class='"+classPrefix+"ChartAccHeader'>데이터 영역<div class='"+classPrefix+"ChartAccHeaderToggle'><label for='_allData'>전체 영역 선택<span class='_toggle'></span></ label><input type='checkbox' onclick='DLG.chgChart()' id='_allData'></div></div>"
  +"      <div class='"+classPrefix+"ChartAccContent datas'>"
  +"        <ul>"
  +"        </ul>"
  +"      </div>"
  +"    </div>"
  +"  </div>"
  +"  <div class='"+classPrefix+"ChartTabCon' id='tab3Con'>"
  +"    <div class='"+classPrefix+"ChartAccItem'>"
  +"      <div class='"+classPrefix+"ChartAccHeader'>툴팁/데이터 레이블 사용 여부</div>"
  +"      <div class='"+classPrefix+"ChartAccContent'>"
  +"        <input type='checkbox' id='useToolTip' onclick='DLG.chgChart()' checked/>"
  +"        <label for='useToolTip'>툴팁</label>"
  +"        <input type='checkbox' id='useDataLabel' onclick='DLG.chgChart()'/>"
  +"        <label for='useDataLabel'>데이터 레이블</label>"
  +"      </div>"
  +"    </div>"
  +"    <div class='"+classPrefix+"ChartAccItem'>"
  +"      <div class='"+classPrefix+"ChartAccHeader'>색상 파레트</div>"
  +"      <div class='"+classPrefix+"ChartAccContent palette'>"
        for(var i = 0 ; i < _chartColorsArray.length ; i++){
            body += 
            "<label for='colorSet"+i+"'>"
            +"  <input type='radio' id='colorSet"+i+"' value='"+i+"' onclick='DLG.chgChart()' name='colorSet' "+(i===0?'checked':'')+"   />"
            +"  <div>";
              for(var c = 0 ; c < _chartColorsArray[i].length ; c++){
                body += "<div style='background-color:"+_chartColorsArray[i][c]+"'></div>";
              }
             body += 
            "  </div>"
            +"</label>";
        }
          body += 
  "            </div>"
  +"          </div>"
  +"          <div class='"+classPrefix+"ChartAccItem'>"
  +"            <div class='"+classPrefix+"ChartAccHeader'>범례 위치</div>"
  +"            <div class='"+classPrefix+"ChartAccContent'>"
  +"              <input type='radio' id='legendAlignNone' onclick='DLG.chgChart()' name='legendAlign'/>"
  +"              <label for='legendAlignNone'>감춤</label>"
  +"              <input type='radio' id='legendAlignTop' onclick='DLG.chgChart()' name='legendAlign'/>"
  +"              <label for='legendAlignTop'>상단</label>"
  +"              <input type='radio' id='legendAlignBottom' onclick='DLG.chgChart()' name='legendAlign' checked/>"
  +"              <label for='legendAlignBottom'>하단</label>"
  +"              <input type='radio' id='legendAlignLeft' onclick='DLG.chgChart()' name='legendAlign'/>"
  +"              <label for='legendAlignLeft'>좌측</label>"
  +"              <input type='radio' id='legendAlignRight' onclick='DLG.chgChart()' name='legendAlign'/>"
  +"              <label for='legendAlignRight'>우측</label>"
  +"            </div>"
  +"          </div>"
  +"          <div class='"+classPrefix+"ChartAccItem'>"
  +"            <div class='"+classPrefix+"ChartAccHeader'>3d 차트 사용(막대와 파이 형 차트만 가능)</div>"
  +"            <div class='"+classPrefix+"ChartAccContent'>"
  +"            <input type='checkbox' id='chart3D' onclick='DLG.chgChart()'/>"
  +"            <label for='chart3D'>3d 사용</label>"
  +"            </div>"
  +"          </div>"
  +"          <div class='"+classPrefix+"ChartAccItem'>"
  +"            <div class='"+classPrefix+"ChartAccHeader'>데이터 피벗</div>"
  +"            <div class='"+classPrefix+"ChartAccContent'>"
  +"              <input type='checkbox' id='pivotData' onclick='DLG.chgChart()'/>"
  +"              <label for='pivotData'>카테고리/시리즈명 반전</label>"
  +"            </div>"
  +"          </div>"
  +"        </div>"

  +"    </div>"
  +"  </div>"
  +"</div>";

  var dialog = {
    Head : "IB Chart 다이얼로그",
    Body : body,
    Modal : 1,
    CanFocus: 1,
    MinWidth : 700,
    MinHeight : 700,
    CloseClick: 0,
    HeadDrag: true,
    Type: "Chart"
  }
  var pos = {
    "Align":"center, middle", 
    // "Width": "400px", 
    // "Height": "500px",
    "Move": 1,
      X:0,
      Y:0,
      Width : document.body.clientWidth,
      Height : document.body.clientHeight
  };
  // 다이얼로그 오픈
  DLG = IBSheet.showDialog(dialog, pos);
  DLG.Tag.querySelector('.' + classPrefix + 'MenuBody').style.setProperty('margin', '0', 'important');
  DLG.Tag.querySelector('.' + classPrefix + 'MenuBody').style.setProperty('width', '100%', 'important');
  DLG.sheet = this;

  if(!this.Dialog) this.Dialog = DLG;
  //최초 선택한 영역을 DLG에 저장
  // var [categories, datas, categoryCol] = this.makeDataForChart();
  var _info = this.makeDataForChart();
  if(_info){
    DLG.categories = _info[0];
    DLG.datas = _info[1];
    DLG.categoryCol = _info[2];
  } else if (_info === false){
    return;
  }

  DLG.extraOpt = extraOpt ? extraOpt : undefined;

  // 닫기 버튼 옆에 다운로드/확대축소 버튼 추가
  var closeBtn = DLG.Tag.querySelector("." + classPrefix + "MenuClose");
  var extraBtn = document.createElement("div");
  extraBtn.className = classPrefix+"ChartExtraBtn";
  extraBtn.innerHTML = 
  "<button type='button' onclick='DLG.downBtnToggle()' ontouchend='DLG.excelDown()' class='toggleDown' title='"+ (this.Lang.ChartDlg && this.Lang.ChartDlg.Menu ? this.Lang.ChartDlg.Menu.Download : "파일 다운로드") +"'></button>"
  +"<button type='button' class='btnDown' onclick='DLG.imageDown()' title='" + (this.Lang.ChartDlg && this.Lang.ChartDlg.Menu ? this.Lang.ChartDlg.Menu.PngDown : "이미지파일 다운로드") + "'>.png</button>"
  +"<button type='button' class='btnDown' onclick='DLG.excelDown()' title='" + (this.Lang.ChartDlg && this.Lang.ChartDlg.Menu ? this.Lang.ChartDlg.Menu.XlsxDown : "엑셀파일 다운로드") + "'>.xlsx</button>"
  +"<button type='button' onclick='DLG.toggleConfigShow()' ontouchend='DLG.toggleConfigShow()' class='Config' title='"+ (this.Lang.ChartDlg && this.Lang.ChartDlg.Menu ? this.Lang.ChartDlg.Menu.Config : "옵션") +"'></button>"
  +"<button type='button' onclick='DLG.zoomInOut()' ontouchend='DLG.zoomInOut()' class='Zoom' title='"+ (this.Lang.ChartDlg && this.Lang.ChartDlg.Menu ? this.Lang.ChartDlg.Menu.Zoom : "확대/축소") +"'></button>"

  closeBtn.parentNode.insertBefore(extraBtn, closeBtn);


  // 현재 선택된 차트 유형
  DLG.Tag.querySelector("#"+chartType).setAttribute("checked", "true");

  // 다이얼로그 버튼기능 설정
  this.DialogButtonsConfig(DLG, DLG.categories, DLG.datas);

 // Combination차트 사용시 피벗 기능 불허
 if(chartType.indexOf("combination") === 0){
    document.querySelector("#pivotData").parentElement.parentElement.style.display = "none";
  }

  // 두번째 텝 내용 생성
  DLG.makeTab2(true);

  // 차트 생성
  //차트유형 아코디언 동작
  var accItems = document.querySelectorAll("."+classPrefix+"ChartAccItem");
  for(var i = 0; i < accItems.length; i++) {
    (function(index) {
      accItems[index].querySelector("."+classPrefix+"ChartAccHeader").addEventListener("click", function(){
        if(event && (event.target.tagName == "INPUT" || event.target.tagName == "LABEL")) return;
        if(accItems[index].querySelector("."+classPrefix+"ChartAccContent").style.display == "none"){
          accItems[index].querySelector("."+classPrefix+"ChartAccContent").style.display = accItems[index].parentElement.id != "tab3Con" ? "block" : "flex";
        }else{
          accItems[index].querySelector("."+classPrefix+"ChartAccContent").style.display = "none";
        }
      });
    })(i);
  }

  //차트유형 변경
  var chartInput = document.querySelectorAll("input[name=chartType]");
  for(var i = 0; i < chartInput.length; i++) {
    chartInput[i].addEventListener("click",function(){
      // 컴비네이션 차트 사용시 피벗사용 불허
      if(event.target.id.indexOf("combination") === 0) {
          document.querySelector("#pivotData").checked = false;
          document.querySelector("#pivotData").parentElement.parentElement.style.display = "none";
      } else {
        document.querySelector("#pivotData").parentElement.parentElement.style.display = "block";
      }
      DLG.chgChartType();
    });
  }

  // 리사이즈 등록
  var resizeTimer;
  DLG.dialogResize = function(e) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (DLG.Type == "Chart" && DLG.Tag) {
          DLG.Tag.firstChild.style.width = DLG.isZoomIn || window.innerWidth < 700 ? "calc(100vw - 20px)" : "700px";
          var size = DLG.Tag.getBoundingClientRect();
          if (DLG.Tag.querySelector("button.Config") && DLG.Tag.querySelector("button.Config").classList.contains("active")) size.width = size.wdith - DLG.Tag.querySelector('div.' + classPrefix + 'ChartConfig').offsetWidth;

          DLGChart.setSize(size.width - 20, size.height - 70);
        }
    }, 100);
  }
  if (!window.dialogResizeAdded) {
    window.addEventListener("resize", DLG.dialogResize());
    window.dialogResizeAdded = true;
    DLG.Tag.querySelector("." + classPrefix + "MenuBody>div").style.height = "100%";
  }

  if (!this.makeChart(chartType, DLG.categories, DLG.datas, DLG.extraOpt)){
    return
  }
}
/**
 * 다이얼로그 최초 오픈시 차트용 데이터 생성 함수
 * @returns {Array|boolean}
 */
Fn.makeDataForChart = function() {
  // 선택 영역 확인 
  var selectRange = this.getSelectedRanges();
  var errMsg = this.Lang.ChartDlg ? this.Lang.ChartDlg.ErrMsg : "";

  if(selectRange.length>1){
    this.showMessageTime(errMsg["MultipleSelected"] || "MultipleSelected");
    this.closeDialog();
    return false;
  }
  if(selectRange.length === 0 ) {
    this.showMessageTime(this.Lang.ChartDlg.ErrMsg.NoSelectedRange || "NoSelectedRange");
    this.closeDialog();
    return false;
  }
  var selectRows = selectRange.length === 0 ? this.getDataRows(1, 1) : this.getSelectedRows(0, "Visible");
  var cols = this.getCols(),
  startColIdx = cols.indexOf(selectRange[0][1]),
  lastColIdx = cols.indexOf(selectRange[0][3]);
  categoryCol = "";
  if(startColIdx != lastColIdx){
    for(var i = lastColIdx; i >= startColIdx; i--) {
      if(cols[i]==this.RowIndex) continue;
      var type = this.Cols[cols[i]]["Type"];
      var negativeT = ["Int", "Float"];
      var positiveT = ["Text", "Lines", "Enum"]
      if(negativeT.indexOf(type) == -1 && positiveT.indexOf(type) != -1){
        categoryCol = cols[i];
        break;
      }
    }
  }
  var categories = selectRows.filter(function(r){
    return r.Name != "SubSum";
  }).map(function(r){
      return this.getString(r, categoryCol);
  }, this);

  // 데이터 
  var datas = [];
  var selectCols = cols.filter(function(c){ 
    return cols.indexOf(c)>=startColIdx && cols.indexOf(c) <= lastColIdx 
  }).filter(function(c){ 
    return ((this.Cols[c]["Type"]=="Int" || this.Cols[c]["Type"]=="Float") && c != this.RowIndex)
  }, this);
  
  var selectRows = [];
  for(var r = selectRange[0][0];r; r = this.getNextVisibleRow(r)){
    if (r.Name != "SubSum") selectRows.push(r);
    if(r === selectRange[0][2]) break;
  }
  
  if(!selectCols.length) {
    this.showMessageTime(this.Lang.ChartDlg.ErrMsg.NoData || "NoData");
    this.closeDialog();
    return false;
  }
  for(var c = 0 ; c < selectCols.length ; c++) {
    var series = {};
    var lastHeaderRow = this.getHeaderRows()[this.getHeaderRows().length -1];
    series.name = this.getString(lastHeaderRow, selectCols[c]); //series 이름
    series.data = [];
    series.col = selectCols[c];
    for(var r = 0; r < selectRows.length ; r++) {
      series.data.push (selectRows[r][selectCols[c]] );
    }
    datas.push(series);
  }
  return [categories,datas,categoryCol];
}

/**
 * 다이얼로그의 각 버튼 클릭시 기능 정의
 * @param {Dialog Object} DLG 
 * @param {Array[string]} categories 
 * @param {Array[Object]} datas 
 */
Fn.DialogButtonsConfig = function(DLG) {
  var classPrefix = this.Style;

  DLG.moveTab = function(tabid) {
    var btn = event.target;
    var tabs = document.querySelectorAll("."+DLG.sheet.Style+"ChartConfig .active");
    var tabCons = document.querySelectorAll("."+DLG.sheet.Style+"ChartTabCon");
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove("active");
    for (var i = 0; i < tabCons.length; i++) tabCons[i].style.display = "none";
    if (btn.classList.contains("active")) btn.classList.remove("active");
    else btn.classList.add("active"); 
    // document.querySelector("#"+tabid).classList.toggle("active");
    document.querySelector("#"+tabid+"Con").style.display = "block";
  }

  // 다운로드 버튼
  DLG.imageDown = function(returnImg){
    var svgStr = DLGChart.getSVGString();
    var rect = document.querySelector("#DLGChart").getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;
    var blob = new Blob([svgStr],{type:'image/svg+xml;charset=utf-8'});
    var URL = window.URL || window.webkitURL || window;
    var blobURL = URL.createObjectURL(blob);
    var download = function(href, name){
      var link = document.createElement('a');
      link.download = name;
      link.style.opacity = "0";
      DLG.Tag.append(link);
      link.href = href;
      link.click();
      link.parentNode.removeChild(link);
    }
    var image = new Image();
    image.onload = function()  {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, width, height);
      var png = canvas.toDataURL(); // default png
      if(returnImg){
        DLG.tempImgInfo = {
          path:png,
          width:width,
          height:height
        };
      }else{
        download(png, "image.png");
      }
    };
    image.src = blobURL;
  }

  DLG.excelDown = function(){
    DLG.imageDown(1); // 차트 이미지생성
    var imgIntv = setInterval(function(){
      if(DLG.tempImgInfo) {
        clearInterval(imgIntv);
        var sheet = DLG.sheet;
        var param = {},categoryCol = document.querySelector(".categories input[type=radio][name=category]:checked").id;

        param.downRows =  sheet.getSelectedRows(0, "Visible").map(function(r){return sheet.getRowIndex(r);}).join("|");
        
        if(categoryCol != "_none"){
          param.downCols = [categoryCol].concat(Array.prototype.slice.call(DLG.Tag.querySelectorAll("#tab2Con .datas input:checked")).map(function(input){
            return input.id;
          })).join("|");
        }
        param.exFoot = [
          {},
          {
            Cells:[
              {Type:"Img", Value:"|"+DLG.tempImgInfo.path+"|"+DLG.tempImgInfo.width+"|"+DLG.tempImgInfo.height, ShrinkToFit: false}
            ]
          }
        ];
        sheet.exportData(param);
        DLG.tempImgInfo = "";
      }
    },300);
  }

  // 두번째 텝에 카테고리, 데이터 선택 체크박스,라디오 생성
  DLG.makeTab2 = function(isNew){
    var chartType = DLG.Tag.querySelector("."+this.sheet.Style+"ChartTabCon#tab1Con input[type=radio]:checked").id;
    var cols = this.sheet.getCols("Visible");
    var lastHeaderRow = this.sheet.getHeaderRows()[this.sheet.getHeaderRows().length -1];
    var isCombi = chartType.indexOf("combination") === 0;
    var CATEGORY = ["<li><input type='radio' name='category' id='_none'  onclick='DLG.chgChart()' ><label for='_none'>없음</label></li>"];
    var selectedCols;
    if(!isNew) {
      selectedCols = Array.prototype.slice.call(DLG.Tag.querySelectorAll("."+this.sheet.Style+"ChartTabCon#tab2Con .datas  ul input:checked")).map(function(input){return input.id});
    }
    if(isCombi) {
      var cls1 = {Name:"영역형차트", Value:"area"};
      var cls2 = {Name:"세로막대",Value:"column"};
      if(chartType=="combination2") {
        cls2 = {Name:"꺽은선차트",Value:"line"};
        cls1 = {Name:"세로막대",Value:"column"};
      }

      // 콤비네이션 차트 사용시 Tab2 디자인 변경
      var DATAS1 = [],DATAS2 = [];
      for(var c = 0 ; c < cols.length ; c ++ ) {
        if(cols[c]==this.sheet.RowIndex) continue;
        var type = this.sheet.Cols[cols[c]]["Type"];
        if(type == "Int" || type == "Float") {
          DATAS1.push("<li><input type='radio' onclick='DLG.chgChart()' id='"+cols[c]+"_____1' name='"+cols[c]+"'><label for='"+cols[c]+"_____1'>"+lastHeaderRow[cols[c]]+"</label></li>");
          DATAS2.push("<li><input type='radio' onclick='DLG.chgChart()' id='"+cols[c]+"_____2' name='"+cols[c]+"'><label for='"+cols[c]+"_____2'>"+lastHeaderRow[cols[c]]+"</label></li>");
        }else if (type == "Text" || type == "Lines" || type == "Enum") {
          CATEGORY.push("<li><input type='radio' name='category' onclick='DLG.chgChart()' id='"+cols[c]+"'><label for='"+cols[c]+"'>"+lastHeaderRow[cols[c]]+"</label></li>");      
        }
      }
      DLG.Tag.querySelector(".datas").innerHTML = "<div class='combinationDiv'>"
      +"<div class='cls1'>"
    // +"  <div>"+cls1.Name+"</div>"
      +"  <div class='__checkAllDiv'>"+"<input type='checkbox' onchange='DLG.selectAll()' id='checkAll_____1' class='checkAll' name='checkAll'><label for='checkAll_____1'>"+cls1.Name+"</label>"+"</div>"
      +"  <ul>"
      +   DATAS1.join('')+"</ul>"
      +"</div>"
      +"<div class='cls2'>"
      +"  <div class='__checkAllDiv'>"+"<input type='checkbox' onchange='DLG.selectAll()' id='checkAll_____2' class='checkAll' name='checkAll'><label for='checkAll_____2'>"+cls2.Name+"</label>"+"</div>"
      +"  <ul>"
      +   DATAS2.join('')+"</ul>"
      +"  </div>"
      +"</div>";
    }else{
      var DATAS = [];
      for(var c = 0 ; c < cols.length ; c ++ ) {
        if(cols[c]==this.sheet.RowIndex) continue;
        var type = this.sheet.Cols[cols[c]]["Type"];
        if(type == "Int" || type == "Float") {
          DATAS.push("<li><input type='checkbox' onclick='DLG.chgChart()' id='"+cols[c]+"'><label for='"+cols[c]+"'>"+lastHeaderRow[cols[c]]+"</label></li>");
        }else if (type == "Text" || type == "Lines" || type == "Enum"){
          CATEGORY.push("<li><input type='radio' name='category' onclick='DLG.chgChart()' id='"+cols[c]+"'><label for='"+cols[c]+"'>"+lastHeaderRow[cols[c]]+"</label></li>");      
        }
      }
      DLG.Tag.querySelector(".datas").innerHTML = "<ul>" + DATAS.join("") + "</ul>";   
    }
    DLG.Tag.querySelector(".categories").innerHTML = "<ul>" + CATEGORY.join("") + "</ul>";  

    var categoryCol = DLG.categoryCol;
    var datas = DLG.datas || getDatas.call(this.sheet);
    var categoryRadio = DLG.Tag.querySelectorAll("input[type='radio'][name='category']");
    // 현재 선택된 category
    if (categoryRadio.length > 1) {
      if (categoryCol && DLG.Tag.querySelector("#"+categoryCol)) DLG.Tag.querySelector("#"+categoryCol).setAttribute("checked", "true");
      else categoryRadio[categoryRadio.length - 1].setAttribute("checked", "true");
      DLG.Tag.querySelector(".categories>ul>li").parentNode.removeChild(DLG.Tag.querySelector(".categories>ul>li"));
    } else DLG.Tag.querySelector("#_none").setAttribute("checked", "true");

    // 현재 선택된 datas
    if(datas.length) {
      if(isNew) {
        if(isCombi){
            var half = Math.ceil(datas.length/2);
            for(var i = 0 ; i < datas.length ; i++) {
              if(i<half){
                DLG.Tag.querySelector("#"+datas[i]["col"]+"_____1").setAttribute("checked", "true");
                datas[i]["type"] = cls1.Value;
              }else{
                DLG.Tag.querySelector("#"+datas[i]["col"]+"_____2").setAttribute("checked", "true");
                datas[i]["type"] = cls2.Value;
              }
            }
        } else {
          for(var i = 0 ; i < datas.length ; i ++){
            DLG.Tag.querySelector("#"+datas[i]["col"]).setAttribute("checked", "true");
          }
        }
      } else {
        if (isCombi){
          if(selectedCols[0].indexOf("_____1") > 0 || selectedCols[0].indexOf("_____2") > 0){
            for(var i = 0 ; i < selectedCols.length ; i ++){
              DLG.Tag.querySelector("#"+selectedCols[i]).setAttribute("checked", "true");
            }
          } else {
            var half = Math.ceil(selectedCols.length/2);
            for(var i = 0 ; i < selectedCols.length ; i ++){
              if(i<half){
                DLG.Tag.querySelector("#"+selectedCols[i]+"_____1").setAttribute("checked", "true");
              }else{
                DLG.Tag.querySelector("#"+selectedCols[i]+"_____2").setAttribute("checked", "true");
              }
            }
          }
        } else {
          if(selectedCols[0].indexOf("_____1") > 0|| selectedCols[0].indexOf("_____2") > 0) selectedCols = selectedCols.map(
            function(s){return s.substring(0,s.length - 6)}
          );
          for(var i = 0 ; i < selectedCols.length ; i ++){
            DLG.Tag.querySelector("#"+selectedCols[i]).setAttribute("checked", "true");
          }
        }
      }
    }
    return true;
  }

  DLG.chgSize = function(w, h){
      if(typeof w == "string" || typeof w == "number") {
        DLG.Tag.firstChild.style.width = isNaN(w) ? w : w+"px"; 
      }
      
      if(typeof h == "string" || typeof h == "number") {
        DLG.Tag.firstChild.style.height = isNaN(h) ? h : h+"px"; 
        DLG.Tag.querySelector("."+classPrefix+"ChartShow").style.height = (DLG.Tag.firstChild.getBoundingClientRect().height - 58) + "px";
      }
  }
  DLG.downBtnToggle = function(){
    var btnWrap = DLG.Tag.querySelector('.'+classPrefix+'ChartExtraBtn');
    if (!btnWrap) return;
    if(btnWrap.classList.contains('active')) {
      btnWrap.classList.remove('active');
    } else {
      btnWrap.classList.add('active');
    }
    
  }
  DLG.zoomInOut = function(isDrag){
    var button = DLG.Tag.querySelector("button.Zoom");

    if(button.getAttribute("zoom") != "out"){
      button.setAttribute("zoom", "out");
      DLG.Tag.firstChild.style.width = "calc(100vw - 20px)";
      DLG.Tag.firstChild.style.height = "calc(100vh - 20px)";  
      DLG.Tag.querySelector("."+classPrefix+"ChartShow").style.height = (window.innerHeight - 70) + "px"
      DLG.popupTopMemo = DLG.Tag.style.top;
      DLG.popupLeftMemo = DLG.Tag.style.left;
      DLG.Tag.style.top = "10px";
      DLG.Tag.style.left = "10px";
      // Config 버튼 disabled
      document.querySelector("button.Config").disabled = true;
      document.querySelector("button.Config").style.opacity = 0.5;
      document.querySelector("button.Config").style.cursor = "default";
    }else{
      button.setAttribute("zoom", "in");
      DLG.Tag.firstChild.style.width = window.innerWidth > 700 ? "700px" : "calc(100vw - 20px)"; 
      DLG.Tag.firstChild.style.height = window.innerHeight > 500 ? "auto" : "calc(100vw - 20px)";  
      DLG.Tag.querySelector("."+classPrefix+"ChartShow").style.height = "500px";
      DLG.Tag.style.top = !isDrag ? DLG.popupTopMemo : DLG.Tag.style.top;
      DLG.Tag.style.left = !isDrag ? DLG.popupLeftMemo : (event.pageX - 350) + "px";
      // Config 버튼 disabled
      document.querySelector("button.Config").disabled = false;
      document.querySelector("button.Config").style.opacity = 1;
      document.querySelector("button.Config").style.cursor = "pointer";
    }
    var size = DLG.Tag.getBoundingClientRect();
    DLGChart.setSize(size.width-20,size.height-70);
    // DLG.MinWidth = DLG.Tag.firstChild.style.width;
    if (button.classList.contains("active")) {
      button.classList.remove("active");
      DLG.isZoomIn = false;
    } else {
      button.classList.add("active");
      DLG.isZoomIn = true;
    }
    // DLGChart.draw();
  }
  DLG.toggleConfigShow = function(init){
    //config 화면 보임
    var btn = !init ? event.target : document.querySelector("."+classPrefix+"ChartExtraBtn .Config");
    if(!document.querySelector("."+classPrefix+"ChartConfig").style.width || document.querySelector("."+classPrefix+"ChartConfig").style.width === "0px"){
      if (!init && !DLG.Tag.querySelector("div.noChart")) DLGChart.setSize(399,518);
      document.querySelector("."+classPrefix+"ChartShow").style.width = "400px";
      document.querySelector("."+classPrefix+"ChartConfig").style.width="280px";
      document.querySelector("."+classPrefix+"ChartConfig").style.transform = "translateX(0%)";
      document.querySelector("."+classPrefix+"ChartConfig").style.opacity = 1;
      // 확대/축소 버튼 disabled
      document.querySelector("button.Zoom").disabled = true;
      document.querySelector("button.Zoom").style.opacity = 0.5;
      document.querySelector("button.Zoom").style.cursor = "default";
    }else{
      //config 화면 감춤
      if (DLGChart.getData().length > 0) DLGChart.setSize(676,518);
      document.querySelector("."+classPrefix+"ChartShow").style.width = "676px";
      document.querySelector("."+classPrefix+"ChartConfig").style.width=0;
      document.querySelector("."+classPrefix+"ChartConfig").style.transform = "translateX(100%)";
      document.querySelector("."+classPrefix+"ChartConfig").style.opacity = 0;
      // 확대/축소 버튼 disabled
      document.querySelector("button.Zoom").disabled = false;
      document.querySelector("button.Zoom").style.opacity = 1;
      document.querySelector("button.Zoom").style.cursor = "pointer";
    }
    if (btn.classList.contains("active")) event.target.classList.remove("active");
    else btn.classList.add("active");
  }  
  DLG.chgChartType = function(){
    // 차트 유형이 바뀌는 경우 (Tab2의 디자인 변경)
    this.makeTab2();
    this.chgChart();
  }
  DLG.chgChart = function(){
    if (event.target.className != "checkAll"){
      var selectAll = document.querySelectorAll(".combinationDiv input.checkAll");
      for(var i = 0; i < selectAll.length ; i++) selectAll[i].checked = false;
    }
    var chartType = DLG.Tag.querySelector("#tab1Con input[type=radio]:checked").id;
    if ((chartType == 'pie' || chartType == 'doughnut') && (document.querySelector("#_none") && document.querySelector("#_none").checked)) {
      DLG.Tag.querySelector("#useDataLabel").checked = false;
      DLG.Tag.querySelector("input[id^=legendAlign]:checked").checked = false;
      DLG.Tag.querySelector("#legendAlignNone").checked = true;
      if (event.target.id == "useDataLabel" || event.target.id.indexOf("legendAlign") != -1) this.sheet.showMessageTime(this.sheet.Lang.ChartDlg ? this.sheet.Lang.ChartDlg.ErrMsg.InvalidSetting : "InvalidSetting");
    }
    var options = {
      chart:{},
      legend:{},
      plotOptions:{}
    };
    // tooltip 사용 여부
    options.tooltip = {
      enabled:DLG.Tag.querySelector("#useToolTip").checked,
      headerFormat: DLG.Tag.querySelector("#_none") && DLG.Tag.querySelector("#_none").checked ? "" : "{series.name}<br/>"
    };

    options.plotOptions.series = options.plotOptions.series||{};
    options.plotOptions.series.dataLabels = {enabled:DLG.Tag.querySelector("#useDataLabel").checked};
    
    // 색상 설정
    options.colors = _chartColorsArray[document.querySelector("input[name^=colorSet]:checked").value];
    document.documentElement.style.setProperty('--chart-color-1', options.colors[0]);
    document.documentElement.style.setProperty('--chart-color-2', options.colors[1]);
    document.documentElement.style.setProperty('--chart-color-3', options.colors[2]);
    
    // 범례 설정
    var legend = DLG.Tag.querySelector("input[id^=legendAlign]:checked").id;
    switch(legend){
      case "legendAlignNone":
        options.legend.enabled = false;
        break;
      case "legendAlignTop":
        options.legend.verticalAlign = "top"; 
        options.legend.layout = "horizontal"; 
        break;
      case "legendAlignBottom":
        options.legend.verticalAlign = "bottom";
        options.legend.layout = "horizontal"; 
        break;
      case "legendAlignLeft":
        options.legend.align = "left"; 
        options.legend.verticalAlign = "middle";
        options.legend.layout = "vertical"; 
        break;
      case "legendAlignRight":
        options.legend.verticalAlign = "middle";
        options.legend.align = "right"; 
        options.legend.layout = "vertical"; 
      break;
    }
    
    if(DLG.Tag.querySelector("#chart3D").checked){
      if(chartType.indexOf("column") === 0){
        options.chart.options3d = {
          enabled: true,
          alpha: 15,
          beta: 15,
          viewDistance: 25,
          depth: 40
        };
      }else if(chartType.indexOf("bar") === 0){
        options.chart.options3d = {
          enabled: true,
          alpha: 5,
          beta: 15,
        };
      }else if(chartType.indexOf("area") === 0){
        options.chart.options3d = {
          enabled: true,
          alpha: 15,
          beta: 30,
          depth: 200
        };
      }else if(chartType == "pie" || chartType == "doughnut") {
        options.chart.options3d = {
          enabled: true,
          alpha: 45,
        };
        options.plotOptions.pie = options.plotOptions.pie||{};
        options.plotOptions.pie.depth= 45;
      }
    }

    DLG.categories = getCategory.call(this.sheet);
    DLG.datas = getDatas.call(this.sheet);
    if (DLG.datas.length === 0 || (document.querySelector("#pivotData").checked && DLG.datas[0].data.length === 0)) {
      this.sheet.showMessageTime(this.sheet.Lang.ChartDlg ? this.sheet.Lang.ChartDlg.ErrMsg.AtLeastOneData : "AtLeastOneData");
      event.target.checked = true;
      DLG.datas = getDatas.call(this.sheet);
    } 
    this.sheet.makeChart(chartType, DLG.categories, DLG.datas, options);
  };
  // 데이터 전체 체크
  DLG.selectAll = function(t){
    var target = t || event.target;
    var datas = target.parentElement.nextElementSibling.querySelectorAll('li>input[type="radio"]');
    var chartType = DLG.Tag.querySelector("#tab1Con input[type=radio]:checked").id;
    if (chartType.indexOf("combination") === 0){
      var checkBox = DLG.Tag.querySelectorAll('input.checkAll');
      for (var i = 0; i < checkBox.length; i++) checkBox[i].checked = false;
      target.checked = true;
      if (target.checked){
        for(var i = 0; i < datas.length; i++) datas[i].checked = true;
      } else {
        for(var i = 0; i < datas.length; i++) datas[i].checked = false;
      }
    }
    DLG.chgChart();
  }
  /**
   * x축 레이블에 표시될 카테고리 수집
   * @returns [String]
   */
  function getCategory(){
    var categories = [];
    var isAll = DLG.Tag.querySelector('#_allData').checked;

    if(document.querySelector("#pivotData").checked) {
      // 데이터 부분의 헤더 영역이 category가 됨.
      var lastHeaderRow = this.getHeaderRows()[this.getHeaderRows().length - 1];
      var selectCols = Array.prototype.slice.call(DLG.Tag.querySelectorAll(".datas input:checked")).map(function(input){return input.id});
      var chartType = DLG.Tag.querySelector("#tab1Con input[type=radio]:checked").id;
      if(chartType.indexOf("combination") === 0){
        selectCols = selectCols.map(function(c){c.substring(0, c.length - 6)});
      }
      for(var i = 0 ; i < selectCols.length ; i ++) {
        categories.push(this.getString( lastHeaderRow, selectCols[i]));
      }
    } else {
      var categoryCol = DLG.Tag.querySelector(".categories input[type=radio]:checked").id;
      categories = (isAll ? this.getDataRows(1, 1) : this.getSelectedRows(0, "Visible")).filter(function(r){
        return r.Name != "SubSum"
      }).map(function(r) {
        return this.getString(r, categoryCol);
      }, this);
    }
    return categories;
  };

  /**
   * 차트에 표시될 데이터 생성
   * @returns [Object]
   */
  function getDatas(){
    var chartType = DLG.Tag.querySelector("#tab1Con input[type=radio]:checked").id;
    var isAll = DLG.Tag.querySelector('#_allData').checked;
    var selectCols,
    selectRows = (isAll ? this.getDataRows(1, 1) : this.getSelectedRows(0, "Visible")).filter(function(r) {
      return r.Name !== "SubSum";
    }.bind(this)),
    datas = [];

    if(document.querySelector("#pivotData").checked) {
      if(chartType.indexOf("combination") === 0){
      // combonation 차트는 피벗 기능을 제공하지 않습니다.
      }else{
        selectCols = Array.prototype.slice.call(DLG.Tag.querySelectorAll("#tab2Con .datas ul input:checked:not(#_allData)")).map(function(input) {
            return input.id;
        });
        var categoryCol = DLG.Tag.querySelector("#tab2Con .categories input[type=radio]:checked").id;
        for(var r = 0 ; r < selectRows.length ; r++) {
          var series = {};
          series.name = this.getString(selectRows[r], categoryCol); //series 이름
          series.data = [];
          for(var c = 0; c < selectCols.length ; c++) {
            series.col = "pivot_"+selectRows[r].id;
            series.data.push (selectRows[r][selectCols[c]] );
          }
          datas.push(series);
        }
      }
    } else {
      if(chartType.indexOf("combination") === 0){
        selectCols =Array.prototype.slice.call(DLG.Tag.querySelectorAll("#tab2Con .datas ul input:checked")).map(function(input){return input.id});
        var cls1 = {Name:"영역형차트", Value:"area"};
        var cls2 = {Name:"세로막대",Value:"column"};
        if(chartType=="combination2") {
          cls1 = {Name:"세로막대",Value:"column"};
          cls2 = {Name:"꺽은선차트",Value:"line"};
        }
        for(var c = 0 ; c < selectCols.length ; c++) {
          var SCol = selectCols[c].substring(0, selectCols[c].length-6);
          var series = {};
          var lastHeaderRow = this.getHeaderRows()[this.getHeaderRows().length -1];
          series.name = this.getString(lastHeaderRow, SCol); //series 이름
          if(selectCols[c].indexOf("_____1") > 0){
            series.type = cls1.Value;
          }else{
            series.type = cls2.Value;
          }
          series.data = [];
          series.col = SCol;
          for(var r = 0; r < selectRows.length ; r++) {
            series.data.push (selectRows[r][SCol] );
          }
          datas.push(series);
        }
      }else{
        selectCols = Array.prototype.slice.call(DLG.Tag.querySelectorAll("#tab2Con .datas input:checked")).map(function(input) {return input.id});
        for(var c = 0 ; c < selectCols.length ; c++) {
          var series = {};
          var lastHeaderRow = this.getHeaderRows()[this.getHeaderRows().length -1];
          series.name = this.getString(lastHeaderRow, selectCols[c]); //series 이름
          series.data = [];
          series.col = selectCols[c];
          for(var r = 0; r < selectRows.length ; r++) {
            series.data.push (selectRows[r][selectCols[c]] );
          }
          datas.push(series);
        }
      }
    }
    return datas;
  };
}
/* 컬럼 정보 설정 시트에 보여질 데이터 */
Fn.makeConfigSheetData = function (headerIndex) {
  var DATA = [],
    headerRows = [],
    cols = this.getCols(),
    title = [];

  if (headerIndex != null && typeof headerIndex === 'number' && headerIndex >= 0) {
    headerRows.push(this.getHeaderRows()[headerIndex]);
  } else {
    headerRows = this.getHeaderRows();
  }

  for (var c = 0; c < cols.length; c++) {
    if (this.getAttribute({ col: cols[c], attr: "Visible" }) || this.Cols[cols[c]].UserHidden) {
      title.length = 0;
      for (var r = 0; r < headerRows.length; r++) {
        title.push(this.getValue(headerRows[r], cols[c]));
      }
      DATA.push({
        "HTitle": title.join("/"),
        "Show": !(this.Cols[cols[c]].UserHidden),
        ColName: cols[c]
      });
    }
  }
  return DATA;
};

/* 컬럼 정보 설정 다이얼로그 */
Fn.showConfigDialog = function (width, height, headerIndex, name) {
  /* step 1 start
   * 현재 시트가 사용 불가능이거나 편집종료되지 못하는 경우 띄우지 않는다.
   */
  if (this.endEdit(true) == -1) return;
  /* step 1 end */

  // 스타일이 중복 되었을때 스타일을 제거한다.
  if (this._stylesConfigDialog && this._stylesConfigDialog.parentNode) {
    this._stylesConfigDialog.parentNode.removeChild(this._stylesConfigDialog);
    delete this._stylesConfigDialog;
  }

  var classDlg = "ConfigPopup";
  var themePrefix = this.Style;

  if (typeof width == "object") {
    var configTemp = width;
    if (configTemp.width != null) width = configTemp.width;
    if (configTemp.height != null) height = configTemp.height;
    if (configTemp.headerIndex != null) headerIndex = configTemp.headerIndex;
    if (configTemp.name != null) name = configTemp.name;
  }

  width = width && typeof width === "number" ? width : 500;
  height = height && typeof height === "number" ? height : 500;
  name = name && typeof name === "string" ? name : ("configSheet_" + this.id);

  var styles = document.createElement("style");
  styles.innerHTML = '.' + themePrefix + classDlg + 'Outer {' +
    '  padding: 10px 50px ;' +
    '  border: 3px solid #37acff;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Close {' +
    '  background-color: #000;' +
    '  width: 17px;' +
    '  height: 17px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head, .' + themePrefix + classDlg + 'Foot {' +
    '  background-color:white;' +
    '  border-top:0px' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head .' + themePrefix + classDlg + 'HeadText >div:last-child {' +
    '  text-align: center;' +
    '  color: #000;' +
    '  font-size: 25px;' +
    '  margin-bottom: 5px;' +
    '  font-weight: 600;' +
    '  height:35px;' +
    '  line-height: normal;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns {' +
    '  text-align:center;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns > button {' +
    '  color: #fff;' +
    '  font-family: "NotoSans_Medium";' +
    '  font-size: 18px;' +
    '  display: inline-block;' +
    '  text-align: center;' +
    '  vertical-align: middle;' +
    '  border-radius: 3px;' +
    '  background-color: #37acff;' +
    '  border: 1px solid #37acff;' +
    '  padding: 5px 10px;' +
    '  margin-left: 5px;' +
    '  cursor: pointer;' +
    '}';

  document.body.appendChild(styles);

  this._stylesConfigDialog = styles;

  /* step 2 start
   * 임시로 컬럼 보임 여부가 보여질 시트div 생성(생성된 다이얼로그로 아래에서 옮김).
   */
  var tmpSheetTag = document.createElement("div");
  tmpSheetTag.className = "SheetTmpTag";
  tmpSheetTag.style.width = "300px";
  tmpSheetTag.style.height = "300px";
  document.body.appendChild(tmpSheetTag);
  /* step 2 end */

  /* step 3 start
   * 띄워져있는 다이얼로그나 팁을 제거.
   */
  this.closeDialog();
  this.hideTip();
  /* step 3 end */

  /* step 4 start
   * 컬럼정보설정 시트에 대한 옵션 설정(컬럼정보설정 시트를 띄운 시트의 옵션을 따라간다.) 및 컬럼정보설정 시트 생성
   */
  var data = this.makeConfigSheetData(headerIndex);
  var ConfigSheet = _IBSheet.create(name, tmpSheetTag, {
    Cfg: { InfoRowConfig: { Visible: 0 }, CanSort: 0, HeaderCheck: 1, CanDrag: 1 },
    Def: { Row: { CanDrag: 1 } },
    Cols: [
      { Header: "헤더타이틀", Type: "Text", Name: "HTitle", RelWidth: 3, Hint: 1, CanEdit: 0, CanSelect: 0, CanFocus: 0, NoColor: 1 },
      { Header: "보임", Type: "Bool", Name: "Show", RelWidth: 1, MinWidth: 90, NoColor: 1 },
      { Header: "컬럼명", Type: "Text", Name: "ColName", Visible: 0 },
    ]
  }, data);
  /* step 4 end */

  /* step 5 start
   * 컬럼정보 시트가 띄워질 다이얼로그 창에 대한 설정 및 다이얼로그 생성
   */
  var dialogOpt = {},
    pos = {};
  this.initPopupDialog(dialogOpt, pos, ConfigSheet, {
    cssClass: classDlg
  });

  dialogOpt.Head = "<div>컬럼 정보 저장</div>";
  dialogOpt.Foot = "<div class='" + themePrefix + classDlg + "Btns'>" +
    "  <button id='" + name + "_OkConfigDialog'>확인</button>" +
    "  <button id='" + name + "_CancelConfigDialog'>취소</button>" +
    "</div>";
  dialogOpt.Body = "<div id='" + name + "_ConfigDialogBody' style='width:" + width + "px;height:" + height + "px;overflow:hidden;'></div>"
  dialogOpt = _IBSheet.showDialog(dialogOpt, pos, this);
  /* step 5 end */

  /* step 6 start
   * 다이얼로그 창의 Body에 컬럼정보설정 시트를 옮김 */
  var ConfigDlgBody = document.getElementById(name + "_ConfigDialogBody");
  ConfigDlgBody.innerHTML = "";
  for (var elem = tmpSheetTag.firstChild; elem; elem = tmpSheetTag.firstChild) ConfigDlgBody.appendChild(elem);
  ConfigSheet.MainTag = ConfigDlgBody;
  tmpSheetTag.parentNode.removeChild(tmpSheetTag);
  /* step 6 end */

  /* step 7 start
   * 버튼 클릭시 및 다이얼로그의 시트가 아닌 부분을 클릭했을 때
   */
  var btnOk = document.getElementById(name + "_OkConfigDialog");
  var btnCancel = document.getElementById(name + "_CancelConfigDialog");
  var myArea = ConfigSheet.getElementsByClassName(dialogOpt.Tag, themePrefix + classDlg + "HeadText")[0];
  var self = this;
  myArea.onclick = function () {
    if (self.ARow == null) {
      ConfigSheet.blur();
    }
  }

  var myArea2 = ConfigSheet.getElementsByClassName(dialogOpt.Tag, themePrefix + classDlg + "Foot")[0]
  myArea2.onclick = function () {
    if (self.ARow == null) {
      ConfigSheet.blur();
    }
  }
  btnOk.onclick = function () {
    var rows = ConfigSheet.getDataRows();
    for (var r = 0; r < rows.length; r++) {
      self.setAttribute({ col: rows[r]["ColName"], attr: "Visible", val: rows[r]["Show"], render: 0 });
      self.setAttribute({ col: rows[r]["ColName"], attr: "Hidden", val: !(rows[r]["Show"]), render: 0 });
      if (rows[r]["Show"]) {
        delete self.Cols[rows[r]["ColName"]]["UserHidden"];
      } else {
        self.Cols[rows[r]["ColName"]]["UserHidden"] = true;
      }
    }
    self.saveCurrentInfo(); //현재상태 저장
    self.rerender(); //화면 렌더링

    ConfigSheet.dispose();
    self.closeDialog();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesConfigDialog;
    }
  }
  btnCancel.onclick = function () {
    ConfigSheet.dispose();
    self.closeDialog();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesConfigDialog;
    }
  }
  /* step 7 end */
};

/* 행 정보를 EditDialog 데이터 형태로 만드는 function */
Fn.getRowEditData = function (row, headerIndex, excludeHideCol, nav) {
  if (!row) return false;

  // base sheet의 cols 정보
  var cols = [];
  if (Array.prototype.filter) {
    cols = this.getCols().filter(function (col) {
      return col != "SEQ";
    });
  } else {
    cols = [];
    var arr = this.getCols();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== "SEQ") cols.push(arr[i]);
    }
  }

  // 헤더 cell 정보
  var header = [];
  if (headerIndex != null && typeof headerIndex === 'number' && headerIndex >= 0) {
    header = this.getHeaderRows();
    if (header.length < headerIndex) headerIndex = header.length - 1;
  } else {
    var headerRows = this.getHeaderRows();
    for (var j = 0; j < cols.length; j++) {
      var headerString = "";
      for (var i = 0; i < headerRows.length; i++) {
        if (headerRows[i][cols[j]] != null && headerRows[i][cols[j]] !== "" && headerRows[i][cols[j] + "RowSpan"] !== 0) {
          headerString += headerRows[i][cols[j]] + "/";
        }
      }
      if (headerString.substr(headerString.length - 1, headerString.length) === "/") {
        headerString = headerString.substr(0, headerString.length - 1);
      }
      header.push(headerString);
    }
  }

  var rowData = [],
    fileValues = [],
    fileValue = null;

  // 행 nav 정보
  if (nav) {
    // 출력 결과 [ n / total ]
    var obj = {};
    var visibleRows = this.getRowsByStatus('Visible');

    obj["Spanned"] = 2;
    obj["ExplainSpan"] = 2;
    obj["Explain"] = "[ " + (visibleRows.indexOf(row) + 1) + " / " + visibleRows.length + " ]";
    obj["ExplainAlign"] = "Center";
    obj["ExplainCanEdit"] = 0;
    obj["ExplainCanFocus"] = 0;
    rowData.push(obj);
  }

  // 편집 다이얼로그의 셀에 설정될 옵션들(기존 컬럼에서 가지고옴)
  var checkPoint = [
    "CanEdit",
    "Enum",
    "EnumKeys",
    "Type",
    "EditFormat",
    "DateFormat",
    "DataFormat",
    "Format",
    "CustomFormat",
    "Align",
    "Alias",
    "Link",
    "Path"
  ];

  // 행 데이터 정보
  // "Explain" Col: 헤더 값
  // "Target" Col: 행 데이터 값
  for (var i = 0; i < cols.length; i++) {
    var obj = {};
    fileValue = null;
    obj["Explain"] = headerIndex != null ? header[headerIndex][cols[i]] : header[i];

    for (var key = 0; key < checkPoint.length; key++) {
      var getAttr = this.getAttribute(row, cols[i], checkPoint[key]);
      if (getAttr != null) {
        obj["Target" + checkPoint[key]] = getAttr;
      }
    }

    if (excludeHideCol) obj["Visible"] = this.getAttribute(null, cols[i], "Visible");

    // Formula가 설정된 컬럼은 제외
    if (this.getAttribute(row, cols[i], "Formula")) {
      // continue;
      obj["TargetCanEdit"] = 0;
    }

    if (this.getType(row, cols[i]) == "Lines") {
      obj["Target" + "AcceptEnters"] = 2;
      if (this.getRowHeight(row) == this.RowHeight) obj["Height"] = this.RowHeight * 2;
    }
    // 관계형 Enum 대응
    if (this.getType(row, cols[i]) == "Enum") {
      if (this.getAttribute(row, cols[i], "Related")) {
        var v = row[cols[i]];
        var keyArr = Object.keys(this.Cols[cols[i]]);
        for (var x = 0; x < keyArr.length; x++) {
          if (keyArr[x] != "EnumKeys" && keyArr[x].indexOf("EnumKeys") > -1) {
            var emkey = this.Cols[cols[i]][keyArr[x]];
            var emkeyArr = emkey.split(emkey.substring(0, 1));
            if (emkeyArr.indexOf(v) > -1) {
              obj["TargetEnum"] = this.Cols[cols[i]]["Enum" + keyArr[x].substring(8)];
              obj["TargetEnumKeys"] = emkey;
              obj["TargetCanEdit"] = 0;
            }
          }
        }
      }
    }
    // file 타입 컬럼
    if (this.getType(row, cols[i]) == "File") {
      if (row[cols[i]] && typeof row[cols[i]] != 'string') {
        var f = row[cols[i]].files;
        for (var j = 0; j < f.length; j++) {
          fileValues.push(f[j].name);
        }
      }
      fileValue = fileValues.join(',');
      obj["TargetCanEdit"] = 0;
    }

    obj["ColName"] = cols[i];
    obj["Target"] = fileValue || row[cols[i]];
    rowData.push(obj);
  }

  return rowData;
};

/* 편집 다이얼로그 내에서 띄워질 html 생성 */
Fn.makeEditHtml = function (row, headerIndex, excludeHideCol) {
  var self = this;
    html = [],
    s = "";

  if (this["Accessibility"] == 2) excludeHideCol = true;
  // base sheet의 cols 정보
  var cols = [];
  if (Array.prototype.filter) {
    cols = this.getCols().filter(function (col) {
      return col != "SEQ";
    });
  } else {
    cols = [];
    var arr = this.getCols();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== "SEQ") cols.push(arr[i]);
    }
  }

  // 헤더 cell 정보
  var header = [];
  if (headerIndex != null && typeof headerIndex === 'number' && headerIndex >= 0) {
    header = this.getHeaderRows();
    if (header.length < headerIndex) headerIndex = header.length - 1;
  } else {
    var headerRows = this.getHeaderRows();
    for (var j = 0; j < cols.length; j++) {
      var headerString = "";
      for (var i = 0; i < headerRows.length; i++) {
        if (headerRows[i][cols[j]] != null && headerRows[i][cols[j]] !== "" && headerRows[i][cols[j] + "RowSpan"] !== 0) {
          headerString += headerRows[i][cols[j]] + "/";
        }
      }
      if (headerString.substr(headerString.length - 1, headerString.length) === "/") {
        headerString = headerString.substr(0, headerString.length - 1);
      }
      header.push(headerString);
    }
  }

  html[html.length] = "<div style='width:80%;border-top:2px solid #000000;word-wrap:break-word;'><ul>"

  for (var i = 0; i < cols.length; i++) {
    if (excludeHideCol && !this.getAttribute(null, cols[i], "Visible")) continue;
    // 컬럼명
    s = "<li style='margin:10px 0'><label style='display:inline-block;width:200px' for='htmlEdit_" + cols[i] + "'>"+ (headerIndex != null ? header[headerIndex][cols[i]] : header[i]) + "</label>";
    var val = row[cols[i]] ? row[cols[i]] : "";
    // value 값
    type = this.getCanEdit(row, cols[i]) ? this.getType(row, cols[i]) : "None";
    s += "<div style='display:inline-block;width:calc(100% - 220px);vertical-align:top'>";
    switch(this.getType(row, cols[i])) {
      case "Lines":
        s += "<textarea style='width:100%;height:80px' id='htmlEdit_" + cols[i] + "' title='"+this.Cols[cols[i]].Header+"' />" + val + "</textarea>";
        break;
      case "Pass":
      case "Text":
      case "Int":
      case "Float":
        s += "<input style='width:100%;height:30px' type='text' value='" + val + "' id='htmlEdit_" + cols[i] + "' title='"+this.Cols[cols[i]].Header+"' />";
        break;
      case "Date":
        s += "<input style='width:100%;height:30px' type='text' value='" + this.getString(row, cols[i]) + "' id='htmlEdit_" + cols[i] + "' title='"+this.Cols[cols[i]].Header+"' />";
        break;
      case "Button":
        s += this.getValue(row, cols[i]);
        break;
      case "Enum":
        s += getEnumString(row, cols[i]);
        break;
      case "Bool":
        s += "<input type='radio' " + (val ? "checked" : "") + " id='htmlEdit_" + cols[i] + "' title='"+this.Cols[cols[i]].Header+"' />";
        break;
      case "Radio":
        s += getRadioString(row, cols[i]);
        break;
      case "Img":
        var imgconf = this.getValue(row, cols[i]).split("|");
        s += "<img src='"+imgconf[1]+"' width='"+imgconf[2]+"' height='"+imgconf[3]+"' alt='"+imgconf[9]+"'>";
      default:
        s += this.getString(row, cols[i]);
        break;
    }
    s += "</div></li>"
    html[html.length] = s;
  }
  html[html.length] = "</ul></div>"

  return html.join("");

  function getEnumString(row, col) {
    var enumVal = self.getAttribute(row, col, 'Enum'),
      enumKeysVal = self.getAttribute(row, col, 'EnumKeys'),
      cellValue = self.getValue(row, col),
      result = "<select id='htmlEdit_" + col + "'/>";

    enumVal = enumVal.slice(1).split(enumVal.charAt(0));
    enumKeysVal = enumKeysVal.slice(1).split(enumKeysVal.charAt(0));

    for (var idx = 0; idx < enumVal.length; idx++) {
      tmp = enumKeysVal[idx] != null ? enumKeysVal[idx] : enumVal[idx];
      result += "<option value='" + tmp + "' " + (cellValue == tmp ? "selected" : "") + ">" + enumVal[idx] + "</option>"
    }

    return result + "</select>";
  }

  function getRadioString(row, col) {
    var enumVal = self.getAttribute(row, col, 'Enum'),
      enumKeysVal = self.getAttribute(row, col, 'EnumKeys'),
      tmp, isChecked,
      result = "";

    enumVal = enumVal.slice(1).split(enumVal.charAt(0));
    enumKeysVal = enumKeysVal.slice(1).split(enumKeysVal.charAt(0));

    if (enumVal.length) {
      for (var idx = 0; idx < enumVal.length; idx++) {
        tmp = enumKeysVal[idx] != null ? enumKeysVal[idx] : enumVal[idx];
        isChecked = self.getValue(row, col) == tmp;
        result += "<input type='radio' name='htmlEdit_" + col + "' value='" + tmp +"'" + (isChecked ? "checked" : "") + "><label for='" + tmp + "'>" + enumVal[idx] + "</label>"
      }
    } else {
      return "<input type='radio' " + (row[col] ? "checked" : "") + "/>";
    }

    return result;
  }
};

/* makeEditSheetOpt로 편집 다이얼로그 내에서 띄워질 시트에 대한 기본 옵션을 설정 */
Fn.makeEditSheetOpt = function (row, headerIndex, excludeHideCol, nav) {
  // 편집 다이얼로그 옵션
  var option = new Object();

  option.Cfg = {
    "CustomScroll": this.CustomScroll,
    "TouchScroll": 4,
    "UsePivot": false,
    "DialogSheet": true,
    "InfoRowConfig": {
      "Visible": false
    },
    "Export": {
      "FilePath": this.Export.FilePath
    }
  };

  option.Cols = [{
    "Type": "Text",
    "Name": "Explain",
    "Color": "#EEEEEE",
    "Align": "Center",
    "CanFocus": 0,
    "RelWidth": 1,
    "CanSort": 0,
    "TextStyle": 1
  }, {
    "Type": "Text",
    "Name": "Target",
    "EditFormat": "",
    "RelWidth": 1,
    "CanSort": 0
  }];

  option.Header = {
    "Visible": false
  };

  option.Body = [];
  option.Body.push(this.getRowEditData(row, headerIndex, excludeHideCol, nav) || []);

  return option;
};

/**
 * 편집(상세보기) 다이얼로그
 * showEditDialog 호출 시 편집 다이얼로그를 생성 후 화면에 띄운다.
*/
Fn.showEditDialog = function (row, width, height, headerIndex, name, excludeHideCol, nav) {
  if (!row) return false;

  /* step 1 start
   * 현재 시트가 사용 불가능이거나 편집종료되지 못하는 경우 띄우지 않는다.
   */
  if (this.endEdit(true) == -1) return;
  /* step 1 end */

  // 스타일이 중복 되었을때 스타일을 제거한다.
  if (this._stylesEditDialog && this._stylesEditDialog.parentNode) {
    this._stylesEditDialog.parentNode.removeChild(this._stylesEditDialog);
    delete this._stylesEditDialog;
  }

  var classDlg = "EditPopup";
  var themePrefix = this.Style;

  if (typeof row == "object") {
    var editTemp = row;
    if (editTemp.row != null) row = editTemp.row;
    if (editTemp.width != null) width = editTemp.width;
    if (editTemp.height != null) height = editTemp.height;
    if (editTemp.headerIndex != null) headerIndex = editTemp.headerIndex;
    if (editTemp.name != null) name = editTemp.name;
    if (editTemp.excludeHideCol != null) excludeHideCol = editTemp.excludeHideCol;
    if (editTemp.nav != null) nav = editTemp.nav;
  }

  if (!row) return false; // row가 없는 경우 return
  if (row && row.Kind != 'Data') return false; // row가 데이터 행이 아닌 경우 return

  width = typeof width == "number" ? width : 500;
  height = typeof height == "number" ? height : 500;
  name = typeof name == "string" ? name : ("editSheet_" + this.id);

  var styles = document.createElement("style");
  styles.innerHTML = '.' + themePrefix + classDlg + 'Outer {' +
    '  padding: 10px '+ (nav ? '20' : '50') + 'px ;' +
    '  border: 3px solid #37acff;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Close {' +
    '  background-color: #000;' +
    '  width: 17px;' +
    '  height: 17px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head, .' + themePrefix + classDlg + 'Foot {' +
    '  background-color:white;' +
    '  border-top:0px' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head .' + themePrefix + classDlg + 'HeadText >div:last-child {' +
    '  text-align: center;' +
    '  color: #000;' +
    '  font-size: 25px;' +
    '  margin-bottom: 5px;' +
    '  font-weight: 600;' +
    '  height:35px;' +
    '  line-height: normal;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns {' +
    '  text-align:center;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns > button {' +
    '  color: #fff;' +
    '  font-family: "NotoSans_Medium";' +
    '  font-size: 18px;' +
    '  display: inline-block;' +
    '  text-align: center;' +
    '  vertical-align: middle;' +
    '  border-radius: 3px;' +
    '  background-color: #37acff;' +
    '  border: 1px solid #37acff;' +
    '  padding: 5px 10px;' +
    '  margin-left: 5px;' +
    '  cursor: pointer;' +
    '}' +
    '.' + themePrefix + classDlg + 'NavBtns {' +
    '  display: flex;' +
    '  flex-basis: 60px;' +
    '  height: 100%;' +
    '  align-items: center;' +
    '  justify-content: center;' +
    '  position: relative;' +
    '  margin: 5px;' +
    '}' +
    '.' + themePrefix + classDlg + 'NavBtns > span {' +
    '  user-select: none;' +
    '  font-size: 2.5em;' +
    '  color: cornflowerblue;' +
    '  cursor: pointer;' +
    '}' +
    '.' + themePrefix + classDlg + 'NavBtnsDisable > span {' +
    '  opacity: 0.3;' +
    '  cursor: default;' +
    '}' +
    '.' + themePrefix + classDlg + 'NavBtns > span:active {' +
    '  opacity: 0.3;' +
    '}' +
    '.' + themePrefix + classDlg + 'NavBody {' +
    '  opacity: 0.7;' +
    '  background-size: contain;' +
    '  overflow: hidden;' +
    '  position: absolute;' +
    '}' +
    '.' + themePrefix + classDlg + 'NavMovedBody {' +
    '  opacity: 0.3;' +
    '  display: flex;' +
    '  flex-basis: 60px;' +
    '  height: 100%;' +
    '  align-items: center;' +
    '  justify-content: center;' +
    '  position: absolute;' +
    '}' +
    '.' + themePrefix + classDlg + 'Outer button:hover {' +
    '  opacity: 0.5;' +
    '}' +
    '.' + themePrefix + classDlg + 'NavMovedBody > span {' +
    '  user-select: none;' +
    '  font-size: 2.5em;' +
    '  color: black;' +
    '}'
    ;

  document.body.appendChild(styles);
  this._stylesEditDialog = styles;

  /* step 2 start
   * 임시로 상세보기 시트가 들어갈 div 생성(생성된 다이얼로그로 아래에서 옮김).
   */
  var tmpSheetTag = document.createElement("div");
  tmpSheetTag.className = "SheetTmpTag";
  tmpSheetTag.style.width = "300px";
  tmpSheetTag.style.height = "100px";
  document.body.appendChild(tmpSheetTag);

  // edit-dialog nav sheet
  if (nav) {
    var tmpNavSheetTag = document.createElement("div");
    tmpNavSheetTag.className = "SheetTmpTag";
    tmpNavSheetTag.style.width = "300px";
    tmpNavSheetTag.style.height = "100px";
    document.body.appendChild(tmpNavSheetTag);
  }
  /* step 2 end */

  /* step 3 start
   * 띄워져있는 다이얼로그나 팁을 제거.
   */
  this.closeDialog();
  this.hideTip();
  /* step 3 end */

  /* step 4 start
   * 상세보기 시트에 대한 옵션 설정(상세보기 시트를 띄운 시트의 옵션을 따라간다.) 및 상세보기 시트 생성
   */
  var opts = this.makeEditSheetOpt(row, headerIndex, excludeHideCol, nav);
  var EditSheet = _IBSheet.create(name, tmpSheetTag, opts);

  // edit-dialog nav sheet
  if (nav) {
    Object.assign(opts.Cfg, { IgnoreFocused: true, CanFocus: false });
    var EditNavSheet = _IBSheet.create(name + 'Nav', tmpNavSheetTag, opts); // 숨겨 놓을 시트 초기 설정 만들기;
  }
  var currentRow = row; // 현재 row 정보 저장
  /* step 4 end */

  /* step 5 start
   * 상세보기 시트가 띄워질 다이얼로그 창에 대한 설정 및 다이얼로그 생성
   */
  var dialogOpt = {},
    pos = {};

  this.initPopupDialog(dialogOpt, pos, EditSheet, { cssClass: classDlg }, [EditNavSheet]);
  dialogOpt.Head = "<div>편집 다이얼로그</div>";
  dialogOpt.Foot = "<div class='" + themePrefix + classDlg + "Btns'>" +
    "  <button id='" + name + "_OkEditDialog'>확인</button>" +
    "  <button id='" + name + "_CancelEditDialog'>취소</button>" +
    "</div>";
  // edit-dialog nav sheet
  dialogOpt.Body = "<div style='display:flex;'>"
    + (nav ? " <div><div id='" + name + "_NavPrevBtn' class='" + themePrefix + classDlg + "NavBtns " + (row && !this.getPrevVisibleRow(row) ? themePrefix + classDlg + "NavBtnsDisable" : "") + "'><span>◀</span></div></div>" : "") // 왼쪽으로 이동 버튼
    + " <div id='" + name + "_EditSheetDiv' style='display:flex;'>"
    + "   <div id='" + name + "_EditDialogBody' style='width:" + width + "px;height:" + height + "px;overflow:hidden;'></div>"
    + (nav ? "   <div id='" + name + "_EditNavDialogBody' style='width:" + width + "px;height:" + height + "px;display:none;' class='" + themePrefix + classDlg + "NavBody'></div>" : "") // 숨겨진 시트
    + (nav ? "   <div id='" + name + "_MovedPrevBody' style='width:" + width + "px;height:" + height + "px;display: none;' class='" + themePrefix + classDlg + "NavMovedBody'><span>▶</span></div>" : "")
    + (nav ? "   <div id='" + name + "_MovedNextBody' style='width:" + width + "px;height:" + height + "px;display: none;' class='" + themePrefix + classDlg + "NavMovedBody'><span>◀</span></div>" : "")
    + " </div>"
    + (nav ? " <div><div id='" + name + "_NavNextBtn' class='" + themePrefix + classDlg + "NavBtns " + (row && !this.getNextVisibleRow(row) ? themePrefix + classDlg + "NavBtnsDisable" : "") + "'><span>▶</span></div></div>" : "") // 오른쪽으로 이동 버튼
    + "</div>";
  dialogOpt = _IBSheet.showDialog(dialogOpt, pos, this);
  /* step 5 end */

  /* step 6 start
   * 다이얼로그 창의 Body에 상세보기 시트를 옮김 */
  var EditDlgBody = document.getElementById(name + "_EditDialogBody");
  EditDlgBody.innerHTML = "";
  for (var elem = tmpSheetTag.firstChild; elem; elem = tmpSheetTag.firstChild) EditDlgBody.appendChild(elem);
  EditSheet.MainTag = EditDlgBody;
  tmpSheetTag.parentNode.removeChild(tmpSheetTag);

  // edit-dialog nav sheet
  if (nav) {
    var EditNavDlgBody = document.getElementById(name + "_EditNavDialogBody");
    var MovedPrevBody = document.getElementById(name + "_MovedPrevBody");
    var MovedNextBody = document.getElementById(name + "_MovedNextBody");
    EditNavDlgBody.innerHTML = "";
    for (var elem = tmpNavSheetTag.firstChild; elem; elem = tmpNavSheetTag.firstChild) EditNavDlgBody.appendChild(elem);
    EditNavSheet.MainTag = EditNavDlgBody;
    tmpNavSheetTag.parentNode.removeChild(tmpNavSheetTag);
  }
  /* step 6 end */

  /* step 7 start
   * 버튼 클릭시 및 다이얼로그의 시트가 아닌 부분을 클릭했을 때
   */
  var btnOk = document.getElementById(name + "_OkEditDialog");
  var btnCancel = document.getElementById(name + "_CancelEditDialog");
  var myArea = EditSheet.getElementsByClassName(dialogOpt.Tag, themePrefix + classDlg + "HeadText")[0];
  var myArea2 = EditSheet.getElementsByClassName(dialogOpt.Tag, themePrefix + classDlg + "Foot")[0];
  var self = this;

  myArea.onclick = function () {
    if (self.ARow == null) {
      EditSheet.blur();
    }
  };

  myArea2.onclick = function () {
    if (self.ARow == null) {
      EditSheet.blur();
    }
  };

  // 확인 Button
  btnOk.onclick = function () {
    EditSheet.endEdit(1);
    if (EditSheet.getRowsByStatus('Changed').length) {
      var prow = EditSheet.getFirstRow();
      while (prow) {
        self.setValue(currentRow, prow["ColName"], prow["Target"], 1);
        prow = EditSheet.getNextRow(prow);
      }
    }

    EditSheet.dispose();
    if (EditNavSheet) EditNavSheet.dispose();
    self.closeDialog();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesEditDialog;
    }
  };

  // 취소 Button
  btnCancel.onclick = function () {
    EditSheet.dispose();
    if (EditNavSheet) EditNavSheet.dispose();
    self.closeDialog();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesEditDialog;
    }
  };

  // Nav Button 좌우 시트 이동
  var btnNavPrev = document.getElementById(name + "_NavPrevBtn");
  var btnNavNext = document.getElementById(name + "_NavNextBtn");
  if (nav && btnNavPrev && btnNavNext) {
    btnNavPrev.onclick = function () {
      if (EditSheet.getRowsByStatus('Changed').length && confirm("편집 내용을 저장하시겠습니까?")) {
        // 변경된 내용 저장
        EditSheet.endEdit(1);
        var prow = EditSheet.getFirstRow();
        while (prow) {
          self.setValue(currentRow, prow["ColName"], prow["Target"], 1);
          prow = EditSheet.getNextRow(prow);
        }
      }

      // 이전 행으로 데이터 변경
      var prevRow = self.getPrevVisibleRow(currentRow);
      if (!prevRow) return;
      currentRow = self.updateCurrentRow(EditSheet, name, classDlg, prevRow, headerIndex, excludeHideCol, nav);
    };

    btnNavNext.onclick = function () {
      if (EditSheet.getRowsByStatus('Changed').length && confirm("편집 내용을 저장하시겠습니까?")) {
        // 변경된 내용 저장
        EditSheet.endEdit(1);
        var prow = EditSheet.getFirstRow();
        while (prow) {
          self.setValue(currentRow, prow["ColName"], prow["Target"], 1);
          prow = EditSheet.getNextRow(prow);
        }
      }

      // 이후 행으로 데이터 변경
      var nextRow = self.getNextVisibleRow(currentRow);
      if (!nextRow) return;
      currentRow = self.updateCurrentRow(EditSheet, name, classDlg, nextRow, headerIndex, excludeHideCol, nav);
    };
  }
  /* step 7 end */

  /**
   * step 8 start
   * mobile touch event
   */
  if (nav) {
    var bMoveEvent = false;
    var bStartEvent = false; // touchstart 이벤트 발생 여부 플래그
    var nMoveType = -1; // 현재 판단된 사용자 움직임의 방향
    var htTouchInfo = { // touchstart 시점의 좌표와 시간을 저장하기
      nStartX: -1,
      nStartY: -1,
      nStartTime: 0
    };
    // 수평 방향을 판단하는 기준 기울기
    var nHSlope = ((window.innerHeight / 2) / window.innerWidth).toFixed(2) * 1;
    var direction = null; // 이동 좌우 방향 ['prev', 'next']
    var tmpRow = null; // 이동 row, currentRow 업데이트를 위해 임시 저장
    var isMoved = null; // 이동이 이루어 졌는지 확인: 시트 너비의 절반 이상 이동하지 않으면 이동이 아닌 것으로 간주

    function initTouchInfo() { // 터치 정보들의 값을 초기화하는 함수
      htTouchInfo.nStartX = -1;
      htTouchInfo.nStartY = -1;
      htTouchInfo.nStartTime = 0;
      bStartEvent = false;
      bMoveEvent = false;
    }

    // touchstart 좌표값과 비교하여 현재 사용자의 움직임을 판단하는 함수
    function getMoveType(x, y) {
      // 0은 수평방향, 1은 수직방향
      nMoveType = -1;

      var nX = Math.abs(htTouchInfo.nStartX - x);
      var nY = Math.abs(htTouchInfo.nStartY - y);
      var nDis = nX + nY;
      // 현재 움직인 거리가 기준 거리보다 작을 땐 방향을 판단하지 않는다
      if (nDis < 25) {
        return nMoveType
      }

      var nSlope = parseFloat((nY / nX).toFixed(2), 10);

      if (nSlope < nHSlope) {
        return x - htTouchInfo.nStartX;
      }

      return nMoveType;
    }

    function onStart(e) {
      initTouchInfo(); // 터치 정보를 초기화한다.
      nMoveType = -1; // 이전 터치에 대해 분석한 움직임의 방향도 초기화한다.
      //touchstart 이벤트 시점에 정보를 갱신한다.
      htTouchInfo.nStartX = e.changedTouches[0].pageX;
      htTouchInfo.nStartY = e.changedTouches[0].pageY;
      htTouchInfo.nStartTime = e.timeStamp;
      bStartEvent = true;
    }

    function onMove(e) {
      if (!bStartEvent) {
        return
      }
      bMoveEvent = true; //touchMove 이벤트 발생 여부

      var nX = e.changedTouches[0].pageX;
      var nY = e.changedTouches[0].pageY;

      //현재 touchmMove에서 사용자 터치에 대한 움직임을 판단한다.
      return nMoveType = getMoveType(nX, nY);
    }

    function onEnd(e) {
      if (!bStartEvent) {
        return
      }

      if (bStartEvent && !bMoveEvent) { // 클릭 이벤트
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      //touchmove에서 움직임을 판단하지 못했다면 touchend 이벤트에서 다시 판단한다.
      if (nMoveType < 0) {
        var nX = e.changedTouches[0].pageX;
        var nY = e.changedTouches[0].pageY;
        nMoveType = getMoveType(nX, nY);
      }
      bStartEvent = false;
      nMoveType = -1; //분석한 움직임의 방향도 초기화한다.
      initTouchInfo(); //터치 정보를 초기화한다.

      return true;
    }

    var EditSheetDiv = document.getElementById(name + "_EditSheetDiv");
    var navSheetWidth = parseInt(EditNavDlgBody.style.width);
    // left 계산
    var defaultLeft = 0;
    var outer = getComputedStyle(document.getElementsByClassName(themePrefix + classDlg + 'Outer')[0]);
    defaultLeft += parseInt(outer.paddingLeft) + parseInt(outer.borderLeftWidth);
    defaultLeft += parseInt(getComputedStyle(btnNavPrev.parentElement).width);

    EditSheetDiv.ontouchstart = function (ev) {
      onStart(ev)
    }

    EditSheetDiv.ontouchmove = function (ev) {
      var result = onMove(ev),
        left;

      if (result != -1) {
        if (result > 0) { // get prev
          if (direction != 'prev') {
            var prevRow = self.getPrevVisibleRow(currentRow);
            if (!prevRow) return;

            tmpRow = self.updateCurrentRow(EditNavSheet, name, classDlg, prevRow, headerIndex, excludeHideCol, nav);
            EditNavDlgBody.style.display = '';
            direction = 'prev';
          }
          isMoved = Math.abs(result) > navSheetWidth / 2 ? true : false;
          if (!isMoved) {
            left = result - navSheetWidth + defaultLeft;
            MovedPrevBody.style.display = 'none';
            MovedNextBody.style.display = 'none';
          }
          else MovedPrevBody.style.display = '';
        } else { // get next
          if (direction != 'next') {
            var nextRow = self.getNextVisibleRow(currentRow);
            if (!nextRow) return;

            tmpRow = self.updateCurrentRow(EditNavSheet, name, classDlg, nextRow, headerIndex, excludeHideCol, nav);
            EditNavDlgBody.style.display = '';
            direction = 'next';
          }
          isMoved = Math.abs(result) > navSheetWidth / 2 ? true : false;
          if (!isMoved) {
            left = navSheetWidth + result + defaultLeft;
            MovedPrevBody.style.display = 'none';
            MovedNextBody.style.display = 'none';
          }
          else MovedNextBody.style.display = '';
        }
        EditNavDlgBody.style.left = left + 'px';
      }
    }

    EditSheetDiv.ontouchend = function (ev) {
      onEnd(ev);

      if (isMoved) {
        currentRow = tmpRow;
        self.updateCurrentRow(EditSheet, name, classDlg, currentRow, headerIndex, excludeHideCol, nav);
      }
      EditNavDlgBody.style.display = 'none';
      MovedPrevBody.style.display = 'none';
      MovedNextBody.style.display = 'none';
      direction = null;
      isMoved = null;
    }
  }
  /* step 8 end */

  _IBSheet.Focused = EditSheet;
};

/**
 * Html 편집(상세보기) 다이얼로그
 * showHtmlEditDialog 호출 시 순수 Html 편집 다이얼로그를 생성 후 화면에 띄운다.
*/
Fn.showHtmlEditDialog = function (row, width, height, headerIndex, name, excludeHideCol) {
  if (!row) return false;

  /* step 1 start
   * 현재 시트가 사용 불가능이거나 편집종료되지 못하는 경우 띄우지 않는다.
   */
  if (this.endEdit(true) == -1) return;
  /* step 1 end */

  // 스타일이 중복 되었을때 스타일을 제거한다.
  if (this._stylesHtmlEditDialog && this._stylesHtmlEditDialog.parentNode) {
    this._stylesHtmlEditDialog.parentNode.removeChild(this._stylesHtmlEditDialog);
    delete this._stylesHtmlEditDialog;
  }

  var classDlg = "HtmlEditPopup";
  var themePrefix = this.Style;

  if (typeof row == "object") {
    var htmlEditTemp = row;
    if (htmlEditTemp.row != null) row = htmlEditTemp.row;
    if (htmlEditTemp.width != null) width = htmlEditTemp.width;
    if (htmlEditTemp.height != null) height = htmlEditTemp.height;
    if (htmlEditTemp.headerIndex != null) headerIndex = htmlEditTemp.headerIndex;
    if (htmlEditTemp.name != null) name = htmlEditTemp.name;
    if (htmlEditTemp.excludeHideCol != null) excludeHideCol = htmlEditTemp.excludeHideCol;
  }

  if (!row) return false; // row가 없는 경우 return
  if (row && row.Kind != 'Data') return false; // row가 데이터 행이 아닌 경우 return

  width = typeof width == "number" ? width : 500;
  height = typeof height == "number" ? height : 500;
  name = typeof name == "string" ? name : ("htmlEditSheet_" + this.id);

  var styles = document.createElement("style");
  styles.innerHTML = '.' + themePrefix + classDlg + 'Outer {' +
    '  padding: 10px 50px;' +
    '  border: 3px solid #37acff;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Close {' +
    '  background-color: #000;' +
    '  width: 17px;' +
    '  height: 17px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head, .' + themePrefix + classDlg + 'Foot {' +
    '  background-color:white;' +
    '  border-top:0px' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head .' + themePrefix + classDlg + 'HeadText >div:last-child {' +
    '  text-align: center;' +
    '  color: #000;' +
    '  font-size: 25px;' +
    '  margin-bottom: 5px;' +
    '  font-weight: 600;' +
    '  height:35px;' +
    '  line-height: normal;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns {' +
    '  text-align:center;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns > button {' +
    '  color: #fff;' +
    '  font-family: "NotoSans_Medium";' +
    '  font-size: 18px;' +
    '  display: inline-block;' +
    '  text-align: center;' +
    '  vertical-align: middle;' +
    '  border-radius: 3px;' +
    '  background-color: #37acff;' +
    '  border: 1px solid #37acff;' +
    '  padding: 5px 10px;' +
    '  margin-left: 5px;' +
    '  cursor: pointer;' +
    '}' +
    ' #' + name + '_EditDialogBody > table tr td {' +
    '  padding-left: 5px;' +
    '  padding-bottom: 10px;' +
    '  padding-top: 5px;' +
    '  padding-right: 10px;' +
    '}'
    ;

  document.body.appendChild(styles);
  this._stylesHtmlEditDialog = styles;

  /* step 2 start
   * 임시로 상세보기 시트가 들어갈 div 생성(생성된 다이얼로그로 아래에서 옮김).
   */
  var tmpHtmlTag = document.createElement("div");
  tmpHtmlTag.className = "HtmlTmpTag";
  tmpHtmlTag.style.width = "300px";
  tmpHtmlTag.style.height = "100px";
  document.body.appendChild(tmpHtmlTag);
  /* step 2 end */

  /* step 3 start
   * 띄워져있는 다이얼로그나 팁을 제거.
   */
  this.closeDialog();
  this.hideTip();
  /* step 3 end */

  /* step 4 start
   * 상세보기 html 생성
   */
  var editHtml = this.makeEditHtml(row, headerIndex, excludeHideCol);
  // var EditSheet = _IBSheet.create(name, tmpSheetTag, opts);
  /* step 4 end */

  /* step 5 start
   * 상세보기 시트가 띄워질 다이얼로그 창에 대한 설정 및 다이얼로그 생성
   */
  var dialogOpt = {},
    pos = {};

  this.initPopupDialog(dialogOpt, pos, null, { cssClass: classDlg });
  dialogOpt.Head = "<div>편집 다이얼로그</div>";
  dialogOpt.Foot = "<div class='" + themePrefix + classDlg + "Btns'>" +
    "  <button id='" + name + "_OkEditDialog'>확인</button>" +
    "  <button id='" + name + "_CancelEditDialog'>취소</button>" +
    "</div>";
  dialogOpt.Body = "<div style='display:flex;'>"
    + " <div id='" + name + "_EditHtmlDiv' style='display:flex;'>"
    + "   <div id='" + name + "_EditDialogBody' style='width:" + width + "px;height:" + height + "px;overflow:auto;'></div>"
    + " </div>"
    + "</div>";
  dialogOpt = _IBSheet.showDialog(dialogOpt, pos, this);
  /* step 5 end */

  /* step 6 start
   * 다이얼로그 창의 Body에 상세보기 html을 옮김 */
  var EditDlgBody = document.getElementById(name + "_EditDialogBody");
  EditDlgBody.innerHTML = editHtml;
  /* step 6 end */

  /* step 7 start
   * 버튼 클릭시 및 다이얼로그의 시트가 아닌 부분을 클릭했을 때
   */
  var btnOk = document.getElementById(name + "_OkEditDialog");
  var btnCancel = document.getElementById(name + "_CancelEditDialog");
  var self = this;

  // 확인 Button
  btnOk.onclick = function () {
    var cols = [], elem;
    if (Array.prototype.filter) {
      cols = self.getCols().filter(function (col) {
        return col != "SEQ";
      });
    } else {
      cols = [];
      var arr = self.getCols();
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== "SEQ") cols.push(arr[i]);
      }
    }

    for (var c = 0; c < cols.length; c++) {
      switch(self.getType(row, cols[c])) {
        case "Radio":
          elem = document.querySelector("input[name='htmlEdit_" + cols[c] + "']:checked");
          if (elem && self.getValue(row, cols[c]) != elem.value) self.setValue(row, cols[c], elem.value);
        case "Bool":
          elem = document.getElementById("htmlEdit_" + cols[c]);
          if (elem && self.getValue(row, cols[c]) != elem.checked) self.setValue(row, cols[c], elem.checked);
          break;
        case "Date":
          elem = document.getElementById("htmlEdit_" + cols[c]);
          if (elem && self.getString(row, cols[c]) != elem.value) self.setString(row, cols[c], elem.value);
          break;
        default:
          elem = document.getElementById("htmlEdit_" + cols[c]);
          if (elem && self.getValue(row, cols[c]) != elem.value) self.setValue(row, cols[c], elem.value);
          break;
      }
    }

    self.closeDialog();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesHtmlEditDialog;
    }
  };

  // 취소 Button
  btnCancel.onclick = function () {
    self.closeDialog();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesHtmlEditDialog;
    }
  };
  /* step 7 end */
};

/* Edit 시트의 데이터를 바꾸고 네비게이션을 조정하는 function */
Fn.updateCurrentRow = function (EditSheet, name, classDlg, row, headerIndex, excludeHideCol, nav) {
  var self = this;
  var themePrefix = this.Style;

  var data = self.getRowEditData(row, headerIndex, excludeHideCol, nav);
  EditSheet.loadSearchData({ data: data, sync: 1 });

  if (nav) { // nav buttons disable 적용
    var btnNavPrev = document.getElementById(name + "_NavPrevBtn");
    var btnNavNext = document.getElementById(name + "_NavNextBtn");

    if (row && !self.getPrevVisibleRow(row)) {
      btnNavPrev.classList.add(themePrefix + classDlg + 'NavBtnsDisable');
    } else {
      btnNavPrev.classList.remove(themePrefix + classDlg + 'NavBtnsDisable');
    }

    if (row && !self.getNextVisibleRow(row)) {
      btnNavNext.classList.add(themePrefix + classDlg + 'NavBtnsDisable');
    } else {
      btnNavNext.classList.remove(themePrefix + classDlg + 'NavBtnsDisable');
    }
  }

  return row;
};

Fn.findAllMatchData = function (dataRows, vcols, match) {
    var fDlgSheet = this.fDlgSheet;
    fDlgSheet.findAllData = [];

    for (var i in dataRows){
      if(this.SearchCols) this.dataSearch(dataRows[i], this.SearchCols, fDlgSheet, match);
      else {
        for (var j in vcols) this.dataSearch(dataRows[i], vcols[j], fDlgSheet, match);
      }
    }

    fDlgSheet.loadSearchData({data: fDlgSheet.findAllData});
};

Fn.dataSearch = function (row, col, fDlgSheet, match) {
  if (row.Filtered || row.Hidden) return false;
  var findingVal = this.getString(row, col);
  var colInfo = this.Cols[col];
  var findingColHeader = colInfo.Name;

  if (colInfo.Type == "Img" || colInfo.Type == "Pass") return;
  if (colInfo.Type == "Button") findingVal = this.getValue(row, col);
  if (colInfo.Type == "Link") {
    if (findingVal && findingVal.split("|").length >= 3) findingVal = findingVal.split("|")[2];
    else return;
  }

  if(!row[col] && (findingVal == colInfo.EmptyValue || findingVal == row[col + "EmptyValue"])) return;

  var checkVal = findingVal;
  if (colInfo.Header) {
    findingColHeader = colInfo.Header;
    if(Array.isArray(findingColHeader)) findingColHeader = findingColHeader[findingColHeader.length - 1];
  }

  if (this.id.indexOf("pivotSheet") > -1) {
    findingColHeader = this.getHeaderRows()[this.getHeaderRows().length -1][col];
    if(findingColHeader.indexOf("piv") > -1 || col.indexOf("SUMs") > -1) return false;
  }

  if (!this.SearchCaseSensitive){
    this.SearchExpression = this.SearchExpression.toLowerCase();
    checkVal = checkVal.toLowerCase();
  }

  var matchCon = match ? checkVal == this.SearchExpression : checkVal.indexOf(this.SearchExpression) > -1

  if (checkVal && this.SearchExpression && matchCon){
    var searchedResult = {
      findRowSeq: row.SEQ,
      findColHeader: findingColHeader,
      findRowId: row.id,
      findColName: colInfo.Name,
      findVal: findingVal,
    };

    fDlgSheet.findAllData.push(searchedResult);
  }
};
/*
 * 시트내 찾기 Ctrl+Shift+F
 * 다이얼로그 기능
 */
Fn.findDlgFunc = function (work, evt) {
  var match = document.getElementById(this.id + "_ContentMatchChk").checked;
  var rvalue = document.getElementById(this.id + "_ReplaceTxt").value;
  var includeCantEdit = document.getElementById(this.id + "_IncludeCantEdit").checked;
  var frow = this.getFocusedRow();
  var fcol = this.getFocusedCol();
  var fvalue = this.getString(frow, fcol);
  var param = {
    action: (work === "FindKeyUp" || work === "Replace" || work === "ReplaceKeyUp") ? "Find" : work,
    match: match,
    callback: function () {
      afterFindingToDo(this);
    }
  };
  var vcols = this.getCols("Visible");
  var dataRows = this.getDataRows({noSubTotal: 1});
  var T = this;
  var findDialogBody = document.getElementById(this.id + "_FindDialogBody");
  var findDialogOuterBody = document.getElementById(this.id + "_FindDialogOuterBody");
  var findDlgFoldBtn = document.getElementById(this.id + "_findDlg_sheet_fold_btn");
  var foldExpandInfo = {
    // "▼": { height: "0px", textContent: "▶" ,rotate: 0},
    // "▶": { height: "312px", textContent: "▼" , rotate: 90}
    "0": { height: "0px", rotate: 90},
    "90": { height: "312px", rotate: 0}
  };

  function afterFindingToDo (ibsheet) {
    //검색 된 행/건수 표시
    window[ibsheet.id + "_FindDlg"].Tag.getElementsByTagName("span")[0].innerText = ibsheet.SearchCount ? ibsheet.SearchCount + "건을 찾았습니다." : "";
    //클릭 객체에게 다시 포커스 부여
    evt.srcElement.focus();
    _IBSheet.Focused = null;
    delete ibsheet.SearchMethod;
  }

  // findRows 에 연산을 사용하지 않음. 연산사용하고 싶을시 주석.
  this.SearchMethod = 3;
  this["SearchValueMatch"] = document.getElementById(this.id + "_ContentMatchChk").checked || false;
  this.SearchExpression = document.getElementById(this.id + "_FindTxt").value;
  this.SearchCols = document.getElementById(this.id + "_SelectColChk").value;

  //ESC 클릭시 닫기
  if (work == "outKeyUp") {
    if (evt.keyCode == 27) {
      window[this.id + "_FindDlg"].Close();
    }
    return;
  }

  switch (work) {
    case "Find": //검색
    case "FindPrev": //이전 검색
      if (!this.SearchExpression) {
        alert("검색어를 입력해주세요.");
        document.getElementById(this.id + "_FindTxt").focus();
        return;
      }
    case "Mark": //강조
    case "Select": //선택
      if (!this.SearchExpression) {
        alert("검색어를 입력해주세요.");
        document.getElementById(this.id + "_FindTxt").focus();
        return;
      }
    case "Clear": //취소
      this.findRows(param);
      break;
    case "FindKeyUp": //검색 창 입력
      if (evt.keyCode == 13) {
        if (!this.SearchExpression) {
          alert("검색어를 입력해주세요.");
          document.getElementById(this.id + "_FindTxt").focus();
          return;
        }
        this.findRows(param);
      }
      break;
    case "ChgCaseSense": //대소문자 구분
      //시트 생성시 cfg에 설정한 대소문자 구분 설정을 기억해 둔다.
      this.SearchCaseSensitiveOld = this.SearchCaseSensitive;
      if (evt.srcElement.checked) {
        this.SearchCaseSensitive = 1;
      } else {
        this.SearchCaseSensitive = 0;
      }
      break;
    case "ReplaceKeyUp": //검색 창 입력
      if (evt.keyCode !== 13) {
        delete this.SearchMethod;
        return;
      }
    case "Replace":
      var flag = true;
      var tmp = "";

      if (this.SearchExpression === "") {
        alert("검색어를 입력해주세요.");
        document.getElementById(this.id + "_FindTxt").focus();
        delete this.SearchMethod;
        return;
      }

      if (match) {
        if (fvalue === this.SearchExpression) {
          flag = false;
          tmp = fvalue.sheet_dialog_replaceAll(this.SearchExpression, rvalue, fcol, frow, T, includeCantEdit);
          if (tmp && !this.setString(frow, fcol, tmp, true, true)) {
            alert("바꿀 내용을 정확하게 입력해주세요.");
            return;
          }
        }
      } else {
        if (fvalue.indexOf(this.SearchExpression) > -1 && (this.Cols[fcol].CanEdit || frow[fcol + "CanEdit"] !== 0 || includeCantEdit)) {
          flag = false;
          tmp = fvalue.sheet_dialog_replaceAll(this.SearchExpression, rvalue, fcol, frow, T, includeCantEdit);
          if (tmp && !this.setString(frow, fcol, tmp, true, true)) {
            alert("바꿀 내용을 정확하게 입력해주세요.");
            return;
          }
        }
      }

      if (flag) {
        this.findRows(param);
        frow = this.getFocusedRow();
        fcol = this.getFocusedCol();
        fvalue = this.getString(frow, fcol) || temp;
        if (match) {
          if (fvalue === this.SearchExpression) {
            flag = false;
            tmp = fvalue.sheet_dialog_replaceAll(this.SearchExpression, rvalue, fcol, T, includeCantEdit);
            if (tmp && !this.setString(frow, fcol, tmp, true, true)) {
              alert("바꿀 내용을 정확하게 입력해주세요.");
              return;
            }
          }
          return;
        } else {
          if (fvalue.indexOf(this.SearchExpression) > -1) {
            flag = false;
            tmp = fvalue.sheet_dialog_replaceAll(this.SearchExpression, rvalue, fcol, frow, T, includeCantEdit);
            if (tmp && !this.setString(frow, fcol, tmp, true, true)) {
              alert("바꿀 내용을 정확하게 입력해주세요.");
              return;
            }
          }
        }
      }

      if (!flag) {
        var T = this;
        setTimeout(function() {
          T.findRows(param);
        }, 10);
      }

      break;
    case "ReplaceAll":
      var r = this.getFirstVisibleRow();
      var cols = this.SearchCols ? [this.SearchCols] : this.getCols("Visible");
      var nomatch = true;
      var c, rc, tmp, count = 0;

      if (this.SearchExpression === "") {
        alert("검색어를 입력해주세요.");
        document.getElementById(this.id + "_FindTxt").focus();
        delete this.SearchMethod;
        return;
      }

      while (r) {
        for (var i = 0; i < cols.length; i++) {
          c = cols[i];
          rc = this.getString(r, c);

          if((this.Cols[c].CanEdit === 0 || r.CanEdit === 0 || r[c + "CanEdit"] === 0 || (r.Def && r.Def.CanEdit === 0)  || this.CanEdit === 0) && !includeCantEdit) continue;

          if (match) {
            if (rc === this.SearchExpression) {
              if (nomatch) nomatch = false;
              tmp = rc.sheet_dialog_replaceAll(this.SearchExpression, rvalue, c, r, T, includeCantEdit);
              if (this.setString(r, c, tmp, 0, true)) count++;
            }
          } else {
            if (rc.indexOf(this.SearchExpression) > -1) {
              if (nomatch) nomatch = false;
              tmp = rc.sheet_dialog_replaceAll(this.SearchExpression, rvalue, c, r, T, includeCantEdit);
              if (this.setString(r, c, tmp, 0, true)) count++;
            }
          }
        }
        r = this.getNextVisibleRow(r);
      }
      if (nomatch) {
        alert("일치하는 것이 없습니다.");
        delete this.SearchMethod;
        return;
      } else {
        alert(count + "건이 변경되었습니다.")
        this.renderBody();
      }
      break;

    case "FindAll":
      if (!this.SearchExpression) {
        alert("검색어를 입력해주세요.");
        document.getElementById(this.id + "_FindTxt").focus();
        return;
      }

      this.findAllMatchData(dataRows, vcols, match);
      if(findDlgFoldBtn.dataset.rotate == 0) {
        findDlgFoldBtn.style.transform = "rotate("+foldExpandInfo["0"].rotate+"deg)";
        findDlgFoldBtn.setAttribute("data-rotate", foldExpandInfo["0"].rotate);
      }
      findDialogOuterBody.style.height = foldExpandInfo[findDlgFoldBtn.dataset.rotate].height;
      break;

    case "FoldAndExpand":
      // if(foldExpandInfo.hasOwnProperty(findDlgFoldBtn.textContent)){
        // findDlgFoldBtn.textContent = foldExpandInfo[findDlgFoldBtn.textContent].textContent;
        findDlgFoldBtn.style.transform = "rotate("+foldExpandInfo[findDlgFoldBtn.dataset.rotate].rotate+"deg)"
        findDlgFoldBtn.setAttribute("data-rotate" ,foldExpandInfo[findDlgFoldBtn.dataset.rotate].rotate);
        findDialogOuterBody.style.height = foldExpandInfo[findDlgFoldBtn.dataset.rotate].height;
      // }
      break;
  }

};

Fn.findReplaceOpen = function (evt) {

  var displayState = document.getElementById("sheet_edit_input_div").style.display !== "none";
  evt.target.textContent = displayState ? "+" : "-";
  document.getElementById("sheet_edit_input_div").style.display = displayState ? "none" : "";
  document.getElementById("fidDlgTopLayer_2").style.display = displayState ? "none" : "flex";
  document.getElementById("replace_button_div").style.display = displayState ? "none" : "";
  document.getElementById("include_cant_edit_wrap").style.display = displayState ? "none" : "";
  document.getElementById("replace_sheet_dialog_btn").style.visibility = displayState ? "hidden" : "visible";
  document.getElementById("replace_all_sheet_dialog_btn").style.visibility = displayState ? "hidden" : "visible";
}

String.prototype.sheet_dialog_replaceAll = function(org, dest, fcol, frow, T, includeCantEdit) {
  if(((T.Cols[fcol] && T.Cols[fcol].CanEdit === 0) || frow.CanEdit === 0 || (frow.Def && frow.Def.CanEdit === 0) || frow[fcol + "CanEdit"] === 0 || T.CanEdit === 0) && !includeCantEdit) return false;
	return this.split(org).join(dest);
};

Fn.makeFindDlgSheetOpt = function () {
    var option = new Object();
    option.Cfg = {
      SearchMode: 2,
      CanEdit: false, 
      DialogSheet: true,
      CanColMove: 0,
      CanSort: 0,
      CanSelect: false,
      FocusWholeRow: true,
      InfoRowConfig: {
        Visible: false,
      },
      ZIndex: 300,
    }
    
    option.Def = {
      Row: {
        CanFormula: 1,
      },
      Header: {
        Menu: { Items: [] },
      }
    }
  
    option.Cols = [
      {
        Header: "행",
        Type: "Text",
        Name: "findRowSeq",
        Align: "Center",
        CanEdit: 0,
        MinWidth: 43,
      },
      {
        Header: "열",
        Type: "Text",
        Name: "findColHeader",
        Align: "Center",
        CanEdit: 0,
        MinWidth: 143,
      },
      {
        Header: "값",
        Type: "Text",
        Name: "findVal",
        Align: "Center",
        CanEdit: 0,
        MinWidth: 183,
      },
    ];
  
    option.Events = {
      onClick : function(evtParam) {
        var parentSheet = evtParam.sheet.ParentSheet;
        parentSheet.focus(parentSheet.getRowById(evtParam.row.findRowId), evtParam.row.findColName);
      }
    };

    return option;
}
Fn.showFindDialog = function () {
  if (this.getTotalRowCount() == 0) {
    this.showMessageTime("검색할 데이터가 없습니다.");
    return;
  }

  var sheetId = this.id;
  var dlgName = sheetId + "_FindDlg";
  var self = this;
  var checked1 = this.SearchCaseSensitive ? "checked" : "";
  var checked2 = this["SearchValueMatch"] ? "checked" : "";
  var vcols = this.getCols("Visible");
  var str = "<option value='' selected>전체 컬럼</option>";
  var hr = this.getHeaderRows();
  var height = (typeof height == "number" && height > 200) ? height : 200;
  var sheetName = "findDialogSheet_" + this.id;

  for (var i = 0; i < vcols.length; i++) {
    if (this.Cols[vcols[i]] && (this.Cols[vcols[i]].Type == "Pass" || this.Cols[vcols[i]].Type == "Img")) continue;
    str += ("<option value=" + vcols[i] + ">" + hr[hr.length - 1][vcols[i]] + "</option>");
  }
  // 기존에 열린 창이 있는지 확인.
  if (window[dlgName]) return;

  // 임시로 상세보기 시트가 들어갈 div 생성(생성된 다이얼로그로 아래에서 옮김).
  var tmpSheetTag = document.createElement("div");
  tmpSheetTag.className = "SheetTmpTag";
  tmpSheetTag.style.width = "100%";
  tmpSheetTag.style.height = "100px";
  document.body.appendChild(tmpSheetTag);

  // 띄워져있는 다이얼로그나 팁을 제거.
  this.closeDialog();
  this.hideTip();

  var opt = this.makeFindDlgSheetOpt();
  var findDialogSheet = _IBSheet.create(sheetName, tmpSheetTag, opt);
  findDialogSheet.ParentSheet = this;
  this.fDlgSheet = findDialogSheet;

  var themePrefix = this.Style;

  var styles = document.createElement("style");
  styles.innerHTML = 
  "."+themePrefix+"FindDlgWrap button:hover{opacity:0.5}"
  +"."+themePrefix+"FindDlgWrap #" + sheetId + "_findDlg_sheet_fold_btn{transition: all 0.8s}"
  document.body.appendChild(styles);
  this._stylesFindDialog = styles;


  var btnClass = themePrefix + "DialogButton";
  var DLGBODY = 
    "<div class='" + themePrefix + "FindDlgWrap' style='padding-left: 8px;'>" + 
      "<div class='" + themePrefix + "FindDlgTop' style='width:94.7%;display:flex;justify-content:space-between;' onkeyup='" + sheetId + ".findDlgFunc(\"outKeyUp\", event)'>" +
        "<div style='border-radius:3px;'>" + 
          "<input type='text' style='border:0px;outline:none;' id='" + sheetId + "_FindTxt' onkeyup='" + sheetId + ".findDlgFunc(\"FindKeyUp\", event)' title='검색어 입력' placeholder='검색어 입력' autocomplete='off'/><span></span>" + 
        "</div>" +
        "<div style='margin-left:65px;'>" + 
          "<button type='button' tabindex='-1' class='" + btnClass + "' onclick='" + sheetId + ".findDlgFunc(\"FindPrev\", event)' title='이전 찾기'>↑</button>" +
          "<button type='button' tabindex='-1' class='" + btnClass + "' onclick='" + sheetId + ".findDlgFunc( \"Find\", event)' title='다음 찾기'>↓</button>" + 
          "<button type='button' tabindex='-1' class='" + btnClass + "' onclick='" + sheetId + ".findReplaceOpen(event)' title='바꾸기 기능'>＋</button>" + 
        "</div>" + 
      "</div>" +
      "<div class='" + themePrefix + "FindDlgTop' id='fidDlgTopLayer_2' style='display:none;important;width:94.7%;justify-content:space-between;padding-top:0px;' onkeyup='" + sheetId + ".findDlgFunc(\"outKeyUp\", event)'>" +
        "<div id='sheet_edit_input_div' style='display:none;margin-top:5px;border-radius:3px;'>" + 
          "<input type='text' style='border:0px;outline:none;' id='" + sheetId + "_ReplaceTxt' onkeyup='" + sheetId + ".findDlgFunc(\"ReplaceKeyUp\", event)'  title='바꿀 내용 입력' placeholder='바꿀 내용 입력' autocomplete='off'/>" + 
        "</div>" + 
        "<div id='replace_button_div' style='display:none;margin-top:5px;border-radius:3px;'>" + 
          "<button id='replace_sheet_dialog_btn' type='button' style='visibility:hidden;background:cornflowerblue;margin-top:1px;' class='" + btnClass + "' onclick='" + sheetId + ".findDlgFunc(\"Replace\", event)'>바꾸기</button>" +
          "<button id='replace_all_sheet_dialog_btn' type='button' style='visibility:hidden;background:cornflowerblue;margin-top:1px;' class='" + btnClass + "' onclick='" + sheetId + ".findDlgFunc(\"ReplaceAll\", event)'>모두 바꾸기</button>" +
        "</div>" +
      "</div>" +
      "<div style='clear:both;'></div>" +
      "<div class='" + themePrefix + "FindDlgBottom'  onkeyup='" + sheetId + ".findDlgFunc(\"outKeyUp\", event)'>" + 
        "<div class='" + themePrefix + "S_FIND_CASE' style='margin-bottom:10px;width:94.7%;display:flex;justify-content:space-between;height:50px;position:relative;'>" +
          "<div>" + 
            "<input type='checkbox' id='" + sheetId + "_FindChk' " + checked1 + " onchange='" + sheetId + ".findDlgFunc(\"ChgCaseSense\", event)' /><label for='" + sheetId + "_FindChk'>대/소문자 구분</label>" +
            "<input type='checkbox' id='" + sheetId + "_ContentMatchChk' " + checked2 + " onchange='" + sheetId + ".findDlgFunc(\"ContentMatch\", event)' /><label for='" + sheetId + "_ContentMatchChk'>전체 셀 내용 일치</label>" +
            "<label for='" + sheetId + "_IncludeCantEdit' id='include_cant_edit_wrap' style='position:absolute;left:0.1%;top:45%;display:none;'><input type='checkbox' id='" + sheetId + "_IncludeCantEdit' " + checked2 + " onchange='" + sheetId + ".findDlgFunc(\"IncludeCantEdit\", event)'/>편집 불가 포함</label>" +
          "</div>" +
          "<div>" +
            "<button type='button' class='" + btnClass + "' onclick='" + sheetId + ".findDlgFunc(\"Mark\", event)' style='background:darkcyan;'>강조</button>" +
            "<button type='button' class='" + btnClass + "' onclick='" + sheetId + ".findDlgFunc(\"Select\", event)' style='background:darkcyan; '>선택</button>" +
            "<button type='button' class='" + btnClass + "' onclick='" + sheetId + ".findDlgFunc(\"Clear\", event)' style='background:darkcyan;'>해제</button>" + 
          "</div>" +
        "</div>" +
        "<div class='" + themePrefix + "S_FIND_CASE' style='margin-bottom:10px;width:94.7%;display:flex;justify-content:space-between;'>" +
          "<label for='" + sheetId + "_SelectColChk' style='padding-left:3px;display:flex;align-items:center;'>컬럼 선택</label>" +
          "<select id=" + sheetId + "_SelectColChk style='margin-left:6px;font-size:13px;height:25px;width:67%;outline:none;padding: 0 3px;border:1px solid #888;border-radius:3px;padding-right:24px;cursor:pointer;appearance:auto;background:none;'>" + str + "</select>" +
        "</div>" +
        "<div class='" + themePrefix + "S_FIND_BTN' style='width:94.7%;position:relative;display:flex;justify-content:space-between;'>" +
          "<button id='" + sheetId + "_findDlg_sheet_fold_btn' data-rotate='0' type='button' style='background:white;color:#7a8899;margin-left:0px;' class='" + btnClass + "' onclick='" + sheetId + ".findDlgFunc(\"FoldAndExpand\", event)'>▶</button>" +
          "<button type='button' tabindex='-1' class='" + btnClass + "' onclick='" + sheetId + ".findDlgFunc( \"FindAll\", event)' title='모두 찾기'>모두 찾기</button>" + 
        "</div>" + 
        "<div style='clear:both;'></div>" + 
      "</div>" + 
      "<div style='padding-right: 14px; padding-left: 4px;'>" +
        "<div id='" + sheetId + "_FindDialogOuterBody' style='width:100%;height:0px;overflow:hidden;'>" + 
          "<div id='" + sheetId + "_FindDialogBody' style='width:100%;height:300px;overflow:hidden;'>" + 
        "</div>" + 
        "<div style='height: 12px;'></div>" +
      "</div>" + 
    "</div>";
  
    var dlg = {
    "Head": "IBSheet 검색 / 바꾸기",
    "Body": DLGBODY,
    "Modal": false,
    "MinWidth": 310,
    "MinHeight": 300,
    "Shadow": false,
    "HeadDrag": true,
    "ZIndex": this.ZIndex ? (this.ZIndex + 20) : 270,
    "OnClose": function () {
      self.SearchExpression = window[dlgName].Tag.getElementsByTagName("input")[0].value;
      delete self.SearchMethod;

      //닫을때 스타일을 제거한다.
      if (styles && styles.parentNode) {
        styles.parentNode.removeChild(styles);
        delete self._stylesFindDialog;
      }

      _IBSheet.Focused = self;
      // 기존 창을 제거
      window[dlgName] = null;
      if(self.fDlgSheet) self.fDlgSheet.dispose();
    }
  };

  window[dlgName] = _IBSheet.showDialog(
    dlg,
    {
      Align: "center middle",
      Tag: this.MainTag,
    }
  );

  var FindDialogBody = document.getElementById(sheetId + "_FindDialogBody");
  FindDialogBody.innerHTML = "";
  for (var elem = tmpSheetTag.firstChild; elem; elem = tmpSheetTag.firstChild) FindDialogBody.appendChild(elem);
  findDialogSheet.MainTag = FindDialogBody;
  tmpSheetTag.parentNode.removeChild(tmpSheetTag);

  if (this.SearchExpression) {
    window[dlgName].Tag.getElementsByTagName("input")[0].value = this.SearchExpression;
  }
  var T = this;
  setTimeout(function () {
    window[dlgName].Tag.getElementsByTagName("input")[0].focus();
    window[dlgName].Tag.getElementsByTagName("input")[0].select();
  }, 50);
  _IBSheet.Focused = null;
};

/* 피벗 다이얼로그 생성 정보 삭제 메소드 */
Fn.clearCurrentPivotInfo = function () {
  var key = this.getPivotStorageKey(),
    session = this["StorageSession"] || 0;

  if (window.ClearCache) ClearCache(key, session === 2 ? 1 : 0);
};

/* 피벗 시트에서 원래 시트로 돌릴때 사용하는 메소드(초기화) */
Fn.clearPivotSheet = function () {
  if (this.PivotMaster) {
    if(IBSheet[this.PivotMaster].PivotFiltered && IBSheet[this.PivotMaster].hasFilter()) {
      IBSheet[this.PivotMaster].clearFilter();
      delete IBSheet[this.PivotMaster].PivotFiltered;
    }

    this.dispose();
    this.switchPivotSheet(0);
    IBSheet[this.PivotMaster].PivotSheet = null;
    IBSheet[this.PivotMaster].PivotDetail = null;
  }
};

/* 피벗 다이얼로그 삭제 메소드(키보드 사용) */
Fn.closePivotDialog = function (ev) {
  var closingSheet = this;
  if (ev.keyCode == 27) {
    for (var i = 0; i < Dialogs.length; i++) {
      if (Dialogs[i].PivotDialog) {
        this.beforePivotActiveElemen.focus();
        Dialogs[i].Close();
      }
    }
  }
};

/* 피벗 다이얼로그 생성 메소드 */
Fn.showPivotDialog = function (width, height, name, showType, pivotParams, useStorage) {
  
  // 스타일이 중복 되었을때 스타일을 제거한다.
  if (this._stylesPivotDialog && this._stylesPivotDialog.parentNode) {
    this._stylesPivotDialog.parentNode.removeChild(this._stylesPivotDialog);
    delete this._stylesPivotDialog;
  }

  this.endEdit();

  if (width && typeof width == "object") {
    var pivotTemp = width;
    if (pivotTemp.width != null) width = pivotTemp.width;
    if (pivotTemp.height != null) height = pivotTemp.height;
    if (pivotTemp.name != null) name = pivotTemp.name;
    if (pivotTemp.showType != null) showType = pivotTemp.showType;
    if (pivotTemp.pivotParams != null) pivotParams = pivotTemp.pivotParams;
    if (pivotTemp.useStorage != null) useStorage = pivotTemp.useStorage;
  }

  width = typeof width == "number" && width >= 500 ? width : 500;
  height = typeof height == "number" ? height : 500;
  name = typeof name == "string" ? name : ("pivotDialog_" + this.id);
  pivotParams = typeof pivotParams == "object" ? pivotParams : null;

  var pivotFormat,
    pivotType = "Sum",
    pivotCallback;

  if (pivotParams) {
    pivotFormat = pivotParams.format;
    pivotType = pivotParams.type || "Sum";
    pivotCallback = pivotParams.callback;
  }

  var saveInfo;
  if (!useStorage) {
    this.clearCurrentPivotInfo();
  } else {
    saveInfo = !!this.getCurrentPivotInfo();
    pivotType = saveInfo ? this.getCurrentPivotInfo()["pivotType"] : "Sum";
    width = width < 450 ? 450 : width;
  }

  var classDlg = "pivotPopup";
  var themePrefix = this.Style;
  var styles = document.createElement("style");
  styles.innerHTML = "" +
    ".box {  " +
    "  display:inline-block; " +
    "  border: 1px solid #586980; " +
    "  border-radius:2px;" +
    "  padding: 3px 8px 3px 8px; " +
    "  white-space: nowrap; " +
    "  margin-right: 5px; " +
    "  margin-left: 5px; " +
    "  margin-bottom: 5px; " +
    "  font-size: 12px; " +
    "  cursor: pointer; " +
    "  color: #586980; " +
    "  background-color: #FFFFFF; " +
    "} " +
    ".box:hover {  " +
    "  opacity:0.5; " +
    "} " +
    "." + name + "_table { " +
    "  display: block; " +
    "  float: left; " +
    "  width:calc(50% - 7px); " +
    "  height:100%; " +
    "  border:1px solid #c5c5c5; " +
    "} " +
    "." + name + "_btns { " +
    "  text-align:right; " +
    "  background-color: #e4f5fd; " +
    (showType ? "" : "  padding-top: 15px; ") +
    "} " +
    "." + name + "_btns > input { " +
    "  height: 13px; " +
    "  margin-right: 3px; " +
    "  vertical-align: middle " +
    "} " +
    "." + name + "_btns > label { " +
    "  margin-right: 3px; " +
    "} " +
    "." + name + "_btns > button { " +
    "  color: #fff; " +
    "  font-family: 'NotoSans_Medium'; " +
    "  font-size: 12px; " +
    "  display: inline-block; " +
    "  text-align: center; " +
    "  vertical-align: middle; " +
    "  border-radius: 3px; " +
    "  background-color: #37acff; " +
    "  border: 1px solid #37acff; " +
    "  padding: 5px; " +
    "  margin-left: 5px; " +
    "  cursor: pointer; " +
    "} " +
    "." + name + "_radios { " +
    "  text-align:left; " +
    "  background-color: #e4f5fd; " +
    "  padding-top: 15px; " +
    "  vertical-align: middle;" +
    "} " +
    "." + name + "_radios > input { " +
    "  height: 15px; " +
    "  margin-right: 12px; " +
    "  vertical-align: middle " +
    "} " +
    "." + name + "_radios > label { " +
    "  font-size: 12px; " +
    "  vertical-align: middle " +
    "} " +
    "." + name + "_table > div > div:first-child { " +
    "  text-align:center; " +
    "  background-color:#d9ecea; " +
    "  height: 30px; " +
    "  line-height: 30px; " +
    "  font-size: 15px; " +
    "} " +
    "." + themePrefix + classDlg + " { " +
    "  border:15px solid #e4f5fd; " +
    "  background-color:#e4f5fd; " +
    "} " +
    "." + themePrefix + classDlg + " button:hover{ " +
    "  opacity:0.5; " +
    "} " +
    "." + themePrefix + classDlg + " > div:first-child { " +
    (showType ? "  height: 80% " : "  height: 90% ") +
    "} " +
    "." + themePrefix + classDlg + " > div:nth-child(2) { " +
    "  height: 10% " +
    "} " +
    (showType ?
      "." + themePrefix + classDlg + " > div:nth-child(3) { " +
      "  height: 10% " +
      "} " : "");

  document.body.appendChild(styles)

  this._stylesPivotDialog = styles;

  var dialogOpt = {};
  var Pos = {
    Align: "center middle",
    Tag: (this.PivotSheet ? (this.PivotSheet.MainTag.style.display === "" && this.MainTag.style.display == "none" ? this.PivotSheet.MainTag : this.MainTag) : this.MainTag),
  }

  dialogOpt.Modal = 1;
  dialogOpt.Head = "<div>피벗 테이블 설정</div>";

  var self = this;
  if (this.PivotMaster) {
    self = IBSheet[this.PivotMaster];
  }
  var pivotCols = self.producePivotColumn();
  var pivotTypes = self.producePivotTypes(this.PivotFunc || pivotType);

  var switchSheet = "";
  if(this.PivotSheet){
    if(IBSheet[this.PivotSheet.Index] && IBSheet[this.PivotSheet.Index].MainTag && self.PivotSheet.MainTag.style.display == "none") switchSheet = "<button id= " + name + "_switchToPivot>피벗시트보기</button>";
    else if(self.MainTag.style.display == "none") switchSheet = "<button id= " + name + "_switchToSheet>원본시트보기</button>";
  }
  

  dialogOpt.Body = "<div class='" + themePrefix + classDlg + "' style='width:" + width + "px;height:" + height + "px;' onmousedown='return false' onkeyup='" + this.id + ".closePivotDialog(event)' onmouseup='" + this.id + ".PivotDragMouseUp(event)' onmousemove='" + this.id + ".PivotDragMouseMove(event)'>" +
    "<div>" +
    "<div id='DragTags' style='left: 0px; top: 0px; width: 0px; height: 0px; visibility: visible;'></div>" +
    "<div class='" + name + "_table' >" +
    "<div style='height:50%'>" +
    "<div style='border-bottom: 1px solid #c5c5c5;'>대상 컬럼(일반)</div>" +
    "<div id='" + name + "_NomalCols' class='" + this.Style + "PivotStandards' style='overflow-y:auto; height:calc(100% - 45px);padding:7px;' onselectstart='return false;' onmouseup='" + this.id + ".PivotDragSetItem(this,event)' ontouchstart='return false'> " +
    pivotCols[0] +
    "</div>" +
    "</div>" +
    "<div style='height:50%'>" +
    "<div style='border-bottom: 1px solid #c5c5c5;border-top: 1px solid #c5c5c5;'>대상 컬럼(숫자형)</div>" +
    "<div id='" + name + "_NumberCols' class='" + this.Style + "PivotStandards' style='overflow-y:auto; height:calc(100% - 46px);padding:7px;' onselectstart='return false;' onmouseup='" + this.id + ".PivotDragSetItem(this,event)' ontouchstart='return false'> " +
    pivotCols[1] +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class='" + name + "_table' style='float:right'>" +
    "<div style='height:33%'>" +
    "<div style='border-bottom: 1px solid #c5c5c5;'>가로행 기준</div>" +
    "<div id='" + name + "_PivotRow' class='" + name + "_PivotStandards " + this.Style + "PivotStandards' style='height:calc(100% - 45px);padding:7px; overflow-y: auto;' onmouseup='" + this.id + ".PivotDragSetItem(this,event,1)'>" +
    (pivotCols[2] ? pivotCols[2] : "<i class='CellsInfo' style='color:gray;font-size:12px;'>이곳으로 대상 컬럼을 끌어놓으십시오.</i>") +
    "</div>" +
    "</div>" +
    "<div style='height:33%'>" +
    "<div style='border-bottom: 1px solid #c5c5c5;border-top: 1px solid #c5c5c5;'>세로행 기준</div>" +
    "<div id='" + name + "_PivotCol' class='" + name + "_PivotStandards " + this.Style + "PivotStandards' style='height:calc(100% - 46px);padding:7px; overflow-y: auto;' onmouseup='" + this.id + ".PivotDragSetItem(this,event,1)'>" +
    (pivotCols[3] ? pivotCols[3] : "<i class='CellsInfo' style='color:gray;font-size:12px;'>이곳으로 대상 컬럼을 끌어놓으십시오.</i>") +
    "</div>" +
    "</div>" +
    "<div style='height:34%'>" +
    "<div style='border-bottom: 1px solid #c5c5c5;border-top: 1px solid #c5c5c5;'>데이터 값</div>" +
    "<div id='" + name + "_PivotData' class='" + name + "_PivotStandards " + this.Style + "PivotStandards' style='height:calc(100% - 46px);padding:7px; overflow-y: auto;' onmouseup='" + this.id + ".PivotDragSetItem(this,event,2)'>" +
    (pivotCols[4] ? pivotCols[4] : "<i class='CellsInfo' style='color:gray;font-size:12px;'>이곳으로 대상 컬럼을 끌어놓으십시오.</i>") +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    (showType ? "<div class='" + name + "_radios'><i style='color:black;font-weight:200;font-size:15px;margin-right:15px;'>피벗 타입</i>" + pivotTypes + "</div>" : "") +
    "<div class='" + name + "_btns'>" +
      (useStorage ? "<label for=\'" + name + "_saveStorage\'><input type=\'checkbox\' id=\'" + name + "_saveStorage\'" + (saveInfo ? " checked " : "") + ">피벗 생성 정보 저장</label>" : "") +
      "<button id='" + name + "_clearPivotBtn'>초기화</button>" + switchSheet + "<button id='" + name + "_createPivotBtn'>피벗 테이블 생성</button><button id='" + name + "_cancelBtn'>취소</button></div>" +
    "</div>";

  var result = _IBSheet.showDialog(dialogOpt, Pos);
  result.PivotDialog = 1;
  result.Name = name;
  drag.dialogLeft = result.Tag.offsetLeft;
  drag.dialogTop = result.Tag.offsetTop;

  var btnCancel = document.getElementById(name + "_cancelBtn");
  var btnCreate = document.getElementById(name + "_createPivotBtn");
  var btnClear = document.getElementById(name + "_clearPivotBtn");
  var saveStorage = document.getElementById(name + "_saveStorage");
  var switchToPivot = document.getElementById(name + "_switchToPivot");
  var switchToSheet = document.getElementById(name + "_switchToSheet");
  
  if(switchToPivot){
    switchToPivot.onclick = function(){
      self.PivotSheet.switchPivotSheet(1);
      result.close();
    }
  }
  
  if(switchToSheet){
    switchToSheet.onclick = function(){
      if(self && self.PivotFiltered && self.hasFilter()) {
        self.clearFilter();
      }

      self.PivotSheet.switchPivotSheet(0);
      result.close();
    }
  }

  btnCreate.onclick = function () {
    function findChildren(node) {
      var child = node.firstChild;
      var str = [];
      while (child) {
        if (child.tagName && child.tagName.toLowerCase() == "span") {
          str.push(child.firstChild.getAttribute("colname"));
        }

        child = child.nextSibling;
      }
      return str;
    }

    var targetPRow = findChildren(document.getElementById(name + "_PivotRow"));
    var targetPCol = findChildren(document.getElementById(name + "_PivotCol"));
    var targetPData = findChildren(document.getElementById(name + "_PivotData"));
    var cols = self.findPivotColumn();
    pivotType = showType ? document.querySelector("input[name='PivotTypes']:checked") && document.querySelector("input[name='PivotTypes']:checked").value : pivotType;

    if (useStorage && saveStorage && saveStorage.checked) {
      self.saveCurrentPivotInfo(targetPRow, targetPCol, targetPData, pivotType);
    } else if (useStorage && saveStorage && !saveStorage.checked) self.clearCurrentPivotInfo();

    if (cols.common.length === 0 || cols.number.length === 0) {
      alert("가능한 대상 컬럼이 없습니다.");
      return false;
    }
    if (targetPRow.length === 0 || targetPCol.length === 0 || targetPData.length === 0) {
      alert("피벗 설정이 완료되지 않았습니다.");
      return false;
    }

    setTimeout(function () {
      var criterias = {
        row: cols.common.reduce(function (arr, curVal) {
          arr.push(curVal.Name);
          return arr;
        }, []).join(","),
        col: cols.common.reduce(function (arr, curVal) {
          arr.push(curVal.Name);
          return arr;
        }, []).join(","),
        data: cols.number.reduce(function (arr, curVal) {
          arr.push(curVal.Name);
          return arr;
        }, []).join(",")
      }

      var init = {
        row: targetPRow.join(","),
        col: targetPCol.join(","),
        data: targetPData.join(",")
      }

      // 생성된 피벗 시트가 있는 경우 제거
      if (typeof window["pivotSheet_" + self.id] !== "undefined") {
        window["pivotSheet_" + self.id].dispose();
      }
      self.makePivotTable(criterias, init, pivotFormat, pivotType, pivotCallback);
    }, 10)
    result.Close();
  }

  var tmpSheet = this;
  btnClear.onclick = function () {
    setTimeout(function () {
      if (useStorage && saveStorage) self.clearCurrentPivotInfo();
      delete tmpSheet.PivotRows;
      delete tmpSheet.PivotCols;
      delete tmpSheet.PivotData;
      delete tmpSheet.PivotFunc;
      tmpSheet.PivotSheet && tmpSheet.PivotSheet.clearPivotSheet();
    }, 10)
    result.Close();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesPivotDialog;
    }
  }

  btnCancel.onclick = function () {
    result.Close();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesPivotDialog;
    }
  }
  this.beforePivotActiveElemen = document.activeElement;
  btnCreate.focus();
};

// showPivotDialog로도 호출 가능하게끔 수정
Fn.createPivotDialog = Fn.showPivotDialog;

/* 시트에서 피벗 다이얼로그에 사용될 컬럼 중 일반과 숫자형을 나눠서 반환 */
Fn.findPivotColumn = function () {
  var res = {};
  res.common = [];
  res.number = [];
  var header = this.getHeaderRows()[0];
  var cols = this.getCols().filter(function (col) {
    return col !== "SEQ";
  });
  for (var i = 0; i < cols.length; i++) {
    (this.Cols[cols[i]].Type == "Int" || this.Cols[cols[i]].Type == "Float") ? res.number.push({
      Name: cols[i],
      Value: this.getHeaderRows().filter(function(r){ return r.Visible}).map(function(r){ return r[cols[i]] }).join("/")
    }): res.common.push({
      Name: cols[i],
      Value: this.getHeaderRows().filter(function(r){ return r.Visible}).map(function(r){ return r[cols[i]] }).join("/")
    });
  }

  return res;
};

/* 피벗 다이얼로그 저장된 생성 정보 가져오는 메소드 */
Fn.getCurrentPivotInfo = function () {
  var key = this.getPivotStorageKey(),
    session = this["StorageSession"] || 0,
    val = null;

  if (session) {
    val = LoadCache(key, session === 2 ? 1 : 0);
    val = this.getCompressValue && this.getCompressValue(val, 1);
    if (val) val = JSON.parse(val);
  }

  return val;
};

/* 피벗 다이얼로그 생성 정보 저장시 사용할 키를 가져오는 메소드 */
Fn.getPivotStorageKey = function() {
  return (this["StorageKeyPrefix"] || location.href) + "^pivot" + this.id;
};

/* 드래그된 아이템이 일반이냐 숫자형이냐에 따라 가로행 기준, 세로행 기준, 데이터 값에 들어갈 수 있는지 유무를 판별한다. */
Fn.PivotDragExactTarget = function (target, group) {
  return group.filter(function (col) {
    return target.indexOf(col.Name) > -1
  }).length == target.length;
};

/* 드래그 움직임을 캐치하는 이벤트 */
Fn.PivotDragMouseMove = function (ev) {
  drag.MoveDragObj(ev)
};

/* 드래그로 아이템을 옮겼을때 발생하는 이벤트(아이템 삭제) */
Fn.PivotDragMouseUp = function (ev) {
  if (drag.tag) {
    drag.ClearDragObj();
  }
};

/* 드래그로 아이템을 옮겼을때 발생하는 이벤트(아이템 생성) */
Fn.PivotDragSetItem = function (object, ev) {
  if (drag.tag) {
    var pivotDialog, targetPRow, targetPCol, targetPData, nomalColsArea, numberColsArea;
    for (var i = 0; i < Dialogs.length; i++) {
      if (Dialogs[i].PivotDialog) {
        pivotDialog = Dialogs[i];
        break;
      }
    }

    if (object.className.indexOf("_PivotStandards") > -1) {
      var self = this;

      if (this.PivotMaster) {
        self = IBSheet[this.PivotMaster];
      }

      var cols = self.findPivotColumn();
      var group;
      if (object.id.indexOf("_PivotData") > -1) {
        group = cols.number;
      } else {
        group = cols.common;
      }

      if (!document.documentMode && pivotDialog) {
        targetPRow = GetElem(pivotDialog.Name + "_PivotRow");
        targetPCol = GetElem(pivotDialog.Name + "_PivotCol");
        targetPData = GetElem(pivotDialog.Name + "_PivotData");
        nomalColsArea = GetElem(pivotDialog.Name + "_NomalCols");
        numberColsArea = GetElem(pivotDialog.Name + "_NumberCols");
        targetPRow.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
        targetPCol.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
        targetPData.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
        nomalColsArea.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
        numberColsArea.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
      }

      if (ev.target == targetPCol || ev.target == targetPRow) {
        var total = this.getDataRows();
        var name = drag.tag.firstChild.firstChild.getAttribute("colname");

        function removeData (arr) {
          var result = [];
          for (var i = 0; i < arr.length; i++) {
            if (result.indexOf(arr[i][name]) === -1) {
              result.push(arr[i][name]);
            }
          }
          return result.length;
        }

        var count = total ? removeData(total) : 1;

        if (ev.target == targetPCol && count > 200) {
          alert("피벗 시트 세로행 기준 중복 데이터 개수 초과입니다. \n - 세로행 중복 데이터 개수 : " + count + "\n - 권장되는 세로행 중복 데이터 개수 : 200");
          drag.ClearDragObj();
          return false;
        } else if (ev.target == targetPRow && count > 5000) {
          alert("피벗 시트 가로행 기준 중복 데이터 개수 초과입니다. \n - 가로행 중복 데이터 개수 : " + count + "\n - 권장되는 가로행 중복 데이터 개수 : 5000");
          drag.ClearDragObj();
          return false;
        }
      }

      if (!this.PivotDragExactTarget([drag.tag.firstChild.firstChild.getAttribute("colname")], group)) {
        alert("데이터 값에는 숫자형이, 가로행/세로행 기준에는 그 외의 값이 들어가야합니다.");
        drag.ClearDragObj();
        return false;
      }
    }

    var copy = drag.tag.firstChild.cloneNode(true);
    if (object.firstChild && object.firstChild.className === "CellsInfo") {
      object.removeChild(object.firstChild);
    }
    object.appendChild(copy);
    drag.ClearDragObj(1);

    if (!document.documentMode && pivotDialog) {
      targetPRow = GetElem(pivotDialog.Name + "_PivotRow");
      targetPCol = GetElem(pivotDialog.Name + "_PivotCol");
      targetPData = GetElem(pivotDialog.Name + "_PivotData");
      nomalColsArea = GetElem(pivotDialog.Name + "_NomalCols");
      numberColsArea = GetElem(pivotDialog.Name + "_NumberCols");
      targetPRow.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
      targetPCol.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
      targetPData.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
      nomalColsArea.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
      numberColsArea.classList.remove(this.Style + "PivotDragSetItemAllow", this.Style + "PivotDragSetItemDisallow");
    }

    _IBSheet.cancelEvent(ev, 2);
  }
};

/* 클릭시 드래그 태그 생성하는 이벤트 */
Fn.PivotItemClick = function (tag, ev) {
  var pivotDialog;
  for (var i = 0; i < Dialogs.length; i++) {
    if (Dialogs[i].PivotDialog) {
      drag.dialogLeft = Dialogs[i].Tag.offsetLeft;
      drag.dialogTop = Dialogs[i].Tag.offsetTop;
      pivotDialog = Dialogs[i];
    }
  }

  drag.MakeDragObj(tag, ev)
  document.documentElement.style.cursor = "default";

  if (!document.documentMode && pivotDialog) {
    var targetPRow = GetElem(pivotDialog.Name + "_PivotRow"),
      targetPCol = GetElem(pivotDialog.Name + "_PivotCol"),
      targetPData = GetElem(pivotDialog.Name + "_PivotData"),
      nomalColsArea = GetElem(pivotDialog.Name + "_NomalCols"),
      numberColsArea = GetElem(pivotDialog.Name + "_NumberCols");

    if (this.Cols[tag.childNodes[0].getAttribute("colname")].Type == "Int" || this.Cols[tag.childNodes[0].getAttribute("colname")].Type == "Float") {
      targetPRow.classList.add(this.Style + "PivotDragSetItemDisallow");
      targetPCol.classList.add(this.Style + "PivotDragSetItemDisallow");
      targetPData.classList.add(this.Style + "PivotDragSetItemAllow");
      nomalColsArea.classList.add(this.Style + "PivotDragSetItemDisallow");
      numberColsArea.classList.add(this.Style + "PivotDragSetItemAllow");
    } else {
      targetPRow.classList.add(this.Style + "PivotDragSetItemAllow");
      targetPCol.classList.add(this.Style + "PivotDragSetItemAllow");
      targetPData.classList.add(this.Style + "PivotDragSetItemDisallow");
      nomalColsArea.classList.add(this.Style + "PivotDragSetItemAllow");
      numberColsArea.classList.add(this.Style + "PivotDragSetItemDisallow");
    }
  }

  _IBSheet.cancelEvent(ev, 2);
};

/* 대상 컬럼에 들어갈 셀들을 생성하는 메소드 */
Fn.producePivotColumn = function () {
  var cols = this.findPivotColumn();
  var res = [];
  var strCommon = "",
    strNum = "",
    strPivotRows = "",
    strPivotCols = "",
    strPivotData = "";
  var strCols;
  var T = this;
  var arPivotRows = this.PivotRows ? this.PivotRows.split(",") : this.InitPivotRows ? this.InitPivotRows.split(",") : [],
    arPivotCols = this.PivotCols ? this.PivotCols.split(",") : this.InitPivotCols ? this.InitPivotCols.split(",") : [],
    arPivotData = this.PivotData ? this.PivotData.split(",") : this.InitPivotData ? this.InitPivotData.split(",") : [];

  var saveInfo = this.getCurrentPivotInfo();

  if (cols.common && cols.common.length > 0) {
    if (saveInfo) {
      arPivotRows = saveInfo.targetPRow,
      arPivotCols = saveInfo.targetPCol,
      this.PivotRows = saveInfo.targetPRow.join(","),
      this.PivotCols = saveInfo.targetPCol.join(",");
    }

    for (var i = 0; i < arPivotRows.length; i++) {
      _IBSheet.__.find(cols.common, function (v){
        if (v.Name == arPivotRows[i]) {
          strCols = "<span onmousedown='" + T.id + ".PivotItemClick(this,event);' ontouchstart='" + T.id + ".PivotItemClick(this,event);'><b class='box' colName='" + v.Name + "'>" + v.Value + "</b></span>";
          strPivotRows += strCols;
        }
      });
    }

    for (var i = 0; i < arPivotCols.length; i++) {
      _IBSheet.__.find(cols.common, function (v){
        if (v.Name == arPivotCols[i]) {
          strCols = "<span onmousedown='" + T.id + ".PivotItemClick(this,event);' ontouchstart='" + T.id + ".PivotItemClick(this,event);'><b class='box' colName='" + v.Name + "'>" + v.Value + "</b></span>";
          strPivotCols += strCols;
        }
      });
    }

    for (var i = 0; i < cols.common.length; i++) {
      strCols = "<span onmousedown='" + this.id + ".PivotItemClick(this,event);' ontouchstart='" + this.id + ".PivotItemClick(this,event);'><b class='box' colName='" + cols.common[i].Name + "'>" + cols.common[i].Value + "</b></span>";

      if (!((this.PivotRows && this.PivotRows.indexOf(cols.common[i].Name) > -1) || (!this.PivotRows && this.InitPivotRows && this.InitPivotRows.indexOf(cols.common[i].Name) > -1)) && 
        !((this.PivotCols && this.PivotCols.indexOf(cols.common[i].Name) > -1) || (!this.PivotCols && this.InitPivotCols && this.InitPivotCols.indexOf(cols.common[i].Name) > -1))
      ) {
        strCommon += strCols;
      }
    }
  }

  if (cols.number && cols.number.length > 0) {
    if (saveInfo) {
      arPivotData = saveInfo.targetPData;
      this.PivotData = saveInfo.targetPData.join(",");
    }

    for (var i = 0; i < arPivotData.length; i++) {
      _IBSheet.__.find(cols.number, function (v){
        if (v.Name == arPivotData[i]) {
          strCols = "<span onmousedown='" + T.id + ".PivotItemClick(this,event);' ontouchstart='" + T.id + ".PivotItemClick(this,event);'><b class='box' colName='" + v.Name + "'>" + v.Value + "</b></span>";
          strPivotData += strCols;
        }
      });
    }

    for (var i = 0; i < cols.number.length; i++) {
      strCols = "<span onmousedown='" + this.id + ".PivotItemClick(this,event);' ontouchstart='" + this.id + ".PivotItemClick(this,event);'><b class='box' colName='" + cols.number[i].Name + "'>" + cols.number[i].Value + "</b></span>";

      if (!((this.PivotData && this.PivotData.indexOf(cols.number[i].Name) > -1) || (!this.PivotData && this.InitPivotData && this.InitPivotData.indexOf(cols.number[i].Name) > -1))) {
        strNum += strCols;
      }
    }
  }

  res.push(strCommon);
  res.push(strNum);
  res.push(strPivotRows);
  res.push(strPivotCols);
  res.push(strPivotData);
  return res;
};

/* 피벗 타입 버튼들을 생성하는 메소드 */
Fn.producePivotTypes = function (pivotType) {
  var types = ["Sum", "Count", "Max", "Min"];
  var label = "",
    input = "",
    res = "";

  if (types && types.length > 0) {
    for (var i = 0; i < types.length; i++) {
      label = "<label>" + this.getMessage("Pivot"+types[i],"Text") + "</label>";
      input = "<input type=\'radio\' name=\'PivotTypes\' value=\'" + types[i] + "\'" + (types[i] == pivotType ? " checked>" : ">");

      res += (label + input);
    }
  }

  return res;
};

/* 피벗 다이얼로그 생성 정보 저장 메소드 */
Fn.saveCurrentPivotInfo = function (targetPRow, targetPCol, targetPData, pivotType) {
  var key = this.getPivotStorageKey(),
    pivotInfo = {},
    session = this["StorageSession"] || 0,
    val;

  if (session) {
    pivotInfo["targetPRow"] = targetPRow;
    pivotInfo["targetPCol"] = targetPCol;
    pivotInfo["targetPData"] = targetPData;
    pivotInfo["pivotType"] = pivotType;

    val = this.getCompressValue(JSON.stringify(pivotInfo));
    SaveCache(key, val, session === 2 ? 1 : 0);

    return true;
  }

  return false;
};

/* 멀티레코드 코드 정리해주는 코드 */
Fn.collectColsByMultiRecord = function (cols) {
	var tempCols = [];
	for (var i = 0; i < cols.length; i++) {
		for (var j = 0; j < cols[i].length; j++) {
			if (cols[i][j]) {
				if (typeof cols[i][j].Name == "undefined") continue;
				tempCols[tempCols.length] = cols[i][j];
			}
		}
	}
	return tempCols;
};

/* getDataRows로 가져온 Row들에 대한 DeepCopy */
Fn.deepCopyRows = function () {
	var dataRows = IBSheet.__.clone(this.getDataRows());
	var copyRows = [];

	for (var i = 0; i < dataRows.length; i++) {
		copyRows.push(IBSheet.__.clone(dataRows[i]));
	}

	return copyRows;
};

/* 다이얼로그에 올라갈 시트 생성(업로드시 데이터가 임시로 올라갈 곳) */
Fn.initImportSheet = function (uploadType, width, height, name, colCount, fullLoadData) {
  if(IBSheet[name]) IBSheet[name].dispose();

  var tmpSheetDiv = document.createElement("div");
  tmpSheetDiv.id = "tmpSheetid";
  tmpSheetDiv.style.width = "100%";
  tmpSheetDiv.style.height = "100%";
  tmpSheetDiv.style.position = "absolute";
  tmpSheetDiv.style.top = "-10000px";
  tmpSheetDiv.style.zIndex = "-9999";
  document.body.appendChild(tmpSheetDiv);

  if(fullLoadData) var sheetData = fullLoadData["sheetData"];
  var sheetOpts = this.getUserOptions(1);
  var sheetHeaderRows = this.getHeaderRows();
  var headerValue = "";
  var headerEnumString = "";
  var colsEnum = {};
  var seqHeader = [];
  var leftChk = [];
  var colsEnumKeys = "";
  var columnMapping = [];
  sheetOpts.Def = {};
  sheetOpts.Def.Row = {};
  var calcName = "";
  var seqIndex = -1;
  var sheetColslength = 0;

  // 시트의 이벤트를 그대로 가져오므로, 이벤트를 삭제 합니다.
  delete sheetOpts.Events;

  if (sheetOpts.Cfg["HeaderCheck"] > 0) {
    delete sheetOpts.Cfg.HeaderCheck;
  }

  if (sheetOpts.LeftCols && sheetOpts.LeftCols instanceof Array) {
    sheetOpts.Cols = sheetOpts.LeftCols.concat(sheetOpts.Cols);
    delete sheetOpts.LeftCols;
  }

  if (sheetOpts.RightCols && sheetOpts.RightCols instanceof Array) {
    sheetOpts.Cols = sheetOpts.Cols.concat(sheetOpts.RightCols);
    delete sheetOpts.RigthCols;
  }

  if (this.MultiRecord) {
    delete sheetOpts.Cfg.MultiRecord;
    sheetOpts.Cols = this.collectColsByMultiRecord(sheetOpts.Cols);
  }

  sheetColslength = sheetOpts.Cols.length + colCount;

  for (var i = 0; i < sheetColslength; i++) {

    if (sheetOpts.Cols[i]) {
      sheetOpts.Cols[i].Visible = !sheetOpts.Cols[i].Visible ? (sheetOpts.Cols[i].Visible == null ? 1 : 0) : 1;

      sheetOpts.Cols[i] = IBSheet.__.extend(sheetOpts.Cols[i], {
        Header: {Value : sheetOpts.Cols[i].Name},
        Name: "EXTRACOL" + i,
        Visible: sheetOpts.Cols[i].Visible
      });

      if (sheetOpts.Cols[i].RecordRowSpan) {
        delete sheetOpts.Cols[i].RecordRowSpan;
      }

      if (sheetOpts.Cols[i].RecordColSpan) {
        delete sheetOpts.Cols[i].RecordColSpan;
      }

      if (sheetOpts.Cols[i].RecordHColSpan) {
        delete sheetOpts.Cols[i].RecordHColSpan;
      }

      if (sheetOpts.Cols[i].RecordHColTitle) {
        delete sheetOpts.Cols[i].RecordHColTitle;
      }
    }

    if (!sheetOpts.Cols[i]) {
      sheetOpts.Cols[i] = {
        Type: "Text",
        Name: "EXTRACOL" + i
      }
    }

    if (sheetOpts.Cols[i].Visible) {
      for (var j = 0; j < sheetHeaderRows.length; j++) {
        headerEnumString = headerEnumString.concat((j > 0 ? "/" : "") + (sheetOpts.Cols[i].Required == 1 ? (sheetHeaderRows[j][sheetOpts.Cols[i].Header.Value] + "(필수)") : sheetHeaderRows[j][sheetOpts.Cols[i].Header.Value]));
      }
      headerValue = headerValue.concat("|" + headerEnumString);
      headerEnumString = "";
      colsEnumKeys = colsEnumKeys.concat("|",sheetOpts.Cols[i].Header.Value);
      sheetOpts.Cols[i].Align = "Center";
      sheetOpts.Cols[i].Width = 150;
      delete sheetOpts.Cols[i].DefaultValue;
      delete sheetOpts.Cols[i].RelWidth;
      delete sheetOpts.Cols[i].MinWidth;
      delete sheetOpts.Cols[i].MaxWidth;
      delete sheetOpts.Cols[i].EditEnum;
      delete sheetOpts.Cols[i].Range;
      delete sheetOpts.Cols[i].Button;
      delete sheetOpts.Cols[i].Icon;
      sheetOpts.Cols[i].CanEdit = true;
      sheetOpts.Cols[i].CanFocus = true;
    }
    calcName = calcName.concat(",",sheetOpts.Cols[i].Name + "Color");

    columnMapping.push(i+1);
  }

  sheetOpts.Def.Row = {CanFormula:1, CalcOrder: calcName};

  for (var i = 0; i < sheetOpts.Cols.length; i++) {
    if (sheetOpts.Cols[i] && (typeof sheetOpts.Cols[i].Name == "undefined" || sheetOpts.Cols[i].Name == "" || sheetOpts.Cols[i].Name == null)) {
      if (sheetOpts.Cols[i].Header instanceof Array && sheetOpts.Cols[i].Header.length > 1) {
        for (var j = 1; j < sheetOpts.Cols[i].Header.length; j++) {
          sheetOpts.Cols[i].Header.splice(1, j);
        }
      }
      seqIndex = i;
      continue;
    }

    if (sheetOpts.Cols[i].Required) {
      sheetOpts.Cols[i].RequiredField = 1;
      delete sheetOpts.Cols[i].Required;
    }

    sheetOpts.Cols[i].ColorFormula = function(fr) {
      var colorError = "#FFFF00";
      if (fr.Sheet.Sheet.Cols[fr.HeadRow[fr.Col]]) {
        var isRequired = fr.Sheet.Sheet.Cols[fr.HeadRow[fr.Col]].Required;
        var type = fr.Sheet.Sheet.Cols[fr.HeadRow[fr.Col]].Type;
        var valueTrue = fr.Sheet.Sheet.Cols[fr.HeadRow[fr.Col]].TrueValue || 1;
        var valueFalse = fr.Sheet.Sheet.Cols[fr.HeadRow[fr.Col]].FalseValue || 0;
      }
      var enumValue = new Array();

      if (type === "Int") {
        if (isRequired) {
          if (fr.Value == null || (_IBSheet.__.isString(fr.Value) && fr.Value == "")) {
            return colorError;
          } else {
            return _IBSheet.__.isNumeric(fr.Value) ?  "" : colorError;
          }
        } else {
          return _IBSheet.__.isNumeric(fr.Value) ?  "" : colorError;
        }
      }

      if (type === "Bool") {
        if (isRequired) {
          if (fr.Value == null || (_IBSheet.__.isString(fr.Value) && fr.Value == "")) {
            return colorError;
          }
        } else {
          return (fr.Value == valueTrue || fr.Value == valueFalse) ? "" : colorError;
        }
      }

      if (type === "Text") {
        if (isRequired) {
          if (fr.Value == null || (_IBSheet.__.isString(fr.Value) && fr.Value == "")) {
            return colorError;
          }
        }
      }

      if (type === "Enum") {
        enumValue = fr.Sheet.Sheet.Cols[fr.HeadRow[fr.Col]].Enum.split("|");
        if (isRequired) {
          if (fr.Value == null || (_IBSheet.__.isString(fr.Value) && fr.Value == "")) {
            for (var i = 1; i < enumValue.length; i++) {
              if (fr.Value === enumValue[i]) {
                return;
              }
            }
            return colorError;
          }
        } else {
          for (var i = 1; i < enumValue.length; i++) {
            if (fr.Value === enumValue[i]) {
              return;
            }
          }
          return colorError;
        }
      }

      if (type === "Date") {
        var maskedDate = _IBSheet.stringToDate("" + fr.Value, fr.Sheet.Sheet.Cols[fr.HeadRow[fr.Col]].DataFormat);
        if (isRequired) {
          if (fr.Value == null || (_IBSheet.__.isString(fr.Value) && fr.Value == "")) {
            return colorError;
          }
        }
        else{
          return _IBSheet.__.isDate(maskedDate) ? "" : colorError;
        }
      }
    }

    colsEnum[sheetOpts.Cols[i].Name] = {
      "Type": "Enum",
      "Enum": "|"+headerValue,
      "CanEdit": 1,
      "Value": (!sheetOpts.Cols[i].Header ? "": sheetOpts.Cols[i].Header.Value),
      "EnumKeys": "|"+colsEnumKeys
    };
    sheetOpts.Cols[i].Header = (function (arr, idx) {
      arr.push({
        Value: "컬럼" + idx
      });
      return arr;
    })([], i);

    if (i == seqIndex + 1  && (uploadType === "txt" || uploadType === "csv")) {
      sheetOpts.Cols[i].RelWidth = 1;
    }

    if (i > seqIndex + 1 && (uploadType === "txt" || uploadType === "csv")) {
      sheetOpts.Cols[i].Visible = false;
    }
  }

  colsEnum.id = "HeadRow";
  colsEnum.Kind = "Head";

  sheetOpts.Head = [colsEnum];
  var cellHeader = this.getCell(this.Header, sheetOpts.Head[0][sheetOpts.Cols[1].Name].Value);

  if (cellHeader) {
    var style = getComputedStyle(cellHeader);
    sheetOpts.Head[0].Color = style.backgroundColor;
    sheetOpts.Head[0].TextColor = style.color;
  }

  sheetOpts.Head[0].SEQ = {
    Type: "Text",
    CanEdit: false,
    CanFocus: false,
    Color: sheetOpts.Head[0].Color,
    TextColor: sheetOpts.Head[0].TextColor,
    Visible: false
  }

  sheetOpts.Head[0].chkBool = {
    Type: "Text",
    CanEdit: false,
    CanFocus: false
  }

  seqHeader[0] = {
    Value: "No"
  }
  leftChk[0] = {
    Value: "체크",
    HeaderCheck: 1
  }

  // 다이얼로그 전용 컬럼.
  sheetOpts.LeftCols = [
  {
    Header: seqHeader,
    Name: "SEQ",
    Visible: 1
  },
  {
    Header: leftChk,
    Type: "Bool",
    Name: "chkBool",
    Visible: 1,
    CanEmpty: 3,
    CanEdit: 1,
    ColMerge: 0,
    Align: "Center",
    VAlign: "Middle"
  }];

  sheetOpts.Cfg.FitWidth = 0;

  var defaultEvents = {
    onRenderFirstFinish: function (evtParams) {
      var sheetCols = evtParams.sheet.getCols();
      var colsMap = "";
      for (var i = columnMapping.length; i < sheetCols.length; i++) {
        colsMap += "|";
      }
      colsMap += columnMapping.join("|");

      if (uploadType === "excel") {
        evtParams.sheet.loadExcel({mode: "NoHeader", columnMapping: colsMap});
      }
      else if (uploadType === "txt" || uploadType === "csv") {
        evtParams.sheet.loadText({mode: "NoHeader", colSeparator: " !  @  ", fileExt: uploadType === "csv" ? "csv" : ""});
      }
    },
    onImportFinish: function (evtParams) {
      var sheetCols = evtParams.sheet.getCols();
      var dataLength = Object.keys(evtParams.data[0]).length;
      if (uploadType === "excel") {
        for (var i = dataLength; i < sheetOpts.Cols.length; i++) {
          if (!evtParams.data[0][sheetOpts.Cols[i].Name]) {
            evtParams.sheet.hideCol("EXTRACOL"+i);
          }
        }
      }

      evtParams.sheet.Sheet.makeUploadDialog(width, height, name, evtParams.sheet, calcName, uploadType, sheetHeaderRows);

      for (var i = 0; i < sheetCols.length; i++) {
        if (sheetCols[i] == "chkBool") continue;
        evtParams.sheet.Cols[sheetCols[i]].MasterType = evtParams.sheet.Cols[sheetCols[i]].Type || "Text";
        evtParams.sheet.Cols[sheetCols[i]].Type = "Text";
        evtParams.sheet.Cols[sheetCols[i]].Format = "";
        evtParams.sheet.Cols[sheetCols[i]].DataFormat = "";
        evtParams.sheet.Cols[sheetCols[i]].EditFormat = "";
      }

      if (uploadType === "txt" || uploadType === "csv") {
        var headerRows = evtParams.sheet.getHeaderRows();
        var selectOptsValue = document.getElementById(name + "_UploadTextSep").value;
        var startCol = sheetCols.indexOf("SEQ") == 0 ? 1 : 0;
        if (evtParams.data.length && evtParams.data[0][sheetCols[startCol]].indexOf(selectOptsValue) > -1) {
          var tmpRow = {};
          if (!evtParams.sheet.OrgLoadTextDataValue) evtParams.sheet.OrgLoadTextDataValue = [];
          for (var i = 0; i < evtParams.data.length; i++) {
            tmpRow = {};
            var sepContents = evtParams.sheet.OrgLoadTextDataValue[i] ? evtParams.sheet.OrgLoadTextDataValue[i].split(selectOptsValue) : (evtParams.data[i][sheetCols[startCol]] && evtParams.data[i][sheetCols[startCol]].split(selectOptsValue));
            if (!evtParams.sheet.OrgLoadTextDataValue[i]) evtParams.sheet.OrgLoadTextDataValue[i] = evtParams.data[i][sheetCols[startCol]];
            for (var j = startCol; j < sheetCols.length; j++) {
              if (j != startCol) evtParams.sheet.showCol(sheetCols[j]);
              else {
                evtParams.sheet.Cols[sheetCols[j]].Width = 150;
                evtParams.sheet.Cols[sheetCols[j]].RelWidth = 0;
              }
              tmpRow[sheetCols[j]] = sepContents[j-1];
            }
            evtParams.data[i] = tmpRow;
          }
        }
        headerRows[0].SEQ = "No";
        headerRows[0].SEQAlign = "Center";
        evtParams.sheet.showCol("SEQ");
        evtParams.sheet.moveCol("chkBool", "SEQ", 1, 1);
        for (var i = 0; i < sheetOpts.Cols.length; i++) {
          if (evtParams.data[0][sheetOpts.Cols[i].Name] == null) {
            evtParams.sheet.hideCol("EXTRACOL"+i);
          }
        }
      }

      if (evtParams.data && evtParams.data.length) {
        for (var i = 0; i < evtParams.data.length; i++) {
          evtParams.data[i]["chkBool"] = (i < sheetHeaderRows.length) ? 0 : 1;
        }
      }
    },
    onBeforeDataLoad: function (evtParams) {
      if (evtParams.sheet.textSepApply && (uploadType === "txt" || uploadType === "csv")) {
        for (var i = 0; i < sheetOpts.Cols.length; i++) {
          if (evtParams.data[0][sheetOpts.Cols[i].Name] == null) {
            evtParams.sheet.hideCol("EXTRACOL"+i);
          }
        }
        delete evtParams.sheet.textSepApply;
      }
    }
  };

  var fullLoadEvents = {
    onRenderFirstFinish: function (evtParams) {
      var sheetCols = evtParams.sheet.getCols();
      evtParams.sheet.Sheet.makeUploadDialog(width, height, name, evtParams.sheet, calcName, uploadType, sheetHeaderRows, sheetData);

      for (var i = 0; i < sheetCols.length; i++) {
        if (sheetCols[i] == "chkBool") continue;
        evtParams.sheet.Cols[sheetCols[i]].MasterType = evtParams.sheet.Cols[sheetCols[i]].Type || "Text";
        evtParams.sheet.Cols[sheetCols[i]].Type = "Text";
        evtParams.sheet.Cols[sheetCols[i]].Format = "";
        evtParams.sheet.Cols[sheetCols[i]].DataFormat = "";
        evtParams.sheet.Cols[sheetCols[i]].EditFormat = "";
      }

      evtParams.sheet.loadSearchData(fullLoadData["sheetData"][0]);
    },
    onBeforeDataLoad: function (evtParams) {
      var sheetCols = evtParams.sheet.getCols();
      var dataLength = Object.keys(evtParams.data[0]).length;

      if (uploadType === "excel") {
        for (var i = 1; i < sheetOpts.Cols.length; i++) {
          if (dataLength <= i < sheetOpts.Cols.length && !evtParams.data[0][sheetOpts.Cols[i].Name]) evtParams.sheet.hideCol("EXTRACOL"+i);
          else evtParams.sheet.showCol("EXTRACOL"+i);
        }
      }

      if (evtParams.data && evtParams.data.length) {
        for (var i = 0; i < evtParams.data.length; i++) {
          evtParams.data[i]["chkBool"] = (i < sheetHeaderRows.length) ? 0 : 1;
        }
      }
    }
  };

  var uploadDialogEvents = sheetData ? fullLoadEvents : defaultEvents;

  uploadDialogEvents.onBeforeChange = function (evtParams) {
    if (evtParams.row && evtParams.row.id === "HeadRow") {
      if (evtParams.val == evtParams.oldval) return evtParams.val;
      var sheetCols = evtParams.sheet.getCols();
      var parentSheetCols = evtParams.sheet.Sheet.Cols;

      var listConvert = [
        {Name: "Size", OrgName: "Size"},
        {Name: "EditMask", OrgName: "EditMask"},
        {Name: "ResultMask", OrgName: "ResultMask"},
        {Name: "ResultText", OrgName: "ResultText"},
        {Name: "ResultMessage", OrgName: "ResultMessage"},
        {Name: "EmptyValue", OrgName: "EmptyValue"},
        {Name: "RequiredField", OrgName: "Required"}
      ];

      for (var i = 2; i < sheetCols.length; i++) {
        if (evtParams.val && evtParams.row[sheetCols[i]] == evtParams.val && sheetCols[i] != evtParams.col) {
          evtParams.row[sheetCols[i]] = evtParams.oldval;
        }
        if (evtParams.row[sheetCols[i]] == evtParams.oldval) {
          for (var j = 0; j < listConvert.length; j++) {
            evtParams.sheet.Cols[evtParams.col][listConvert[j]["Name"]] = !evtParams.val ? "" : evtParams.sheet.Sheet.Cols[evtParams.val][listConvert[j]["OrgName"]];
            if (evtParams.col !== sheetCols[i]) evtParams.sheet.Cols[sheetCols[i]][listConvert[j]["Name"]] = !evtParams.oldval ? "" : evtParams.sheet.Sheet.Cols[evtParams.oldval][listConvert[j]["OrgName"]];
          }
        }
      }

      if(parentSheetCols[evtParams.val].Type == 'Date') evtParams.sheet.Cols[evtParams.col].MasterType = "Date";

      evtParams.sheet.refreshRow(evtParams.row);
    }
  };

  uploadDialogEvents.onAfterChange = function (evtParams) {
    if (evtParams.row.id == "HeadRow") {
      evtParams.sheet.calculate(true);
    }
  };

  var opts = {
    Def: sheetOpts.Def,
    Cfg: sheetOpts.Cfg,
    Cols: sheetOpts.Cols,
    LeftCols: uploadType === "excel" ? sheetOpts.LeftCols : [],
    RightCols: (uploadType === "txt" || uploadType === "csv") ? [sheetOpts.LeftCols[1]] : [],
    Head: sheetOpts.Head,
    Events: uploadDialogEvents,
  };
  opts.Cfg.ColorState = 0;
  var UploadSheet = _IBSheet.create({
    id: name,
    el: "tmpSheetid",
    options: opts
  });
  UploadSheet.Sheet = this;
};

/* 업로드 다이얼로그 만들기 */
Fn.makeUploadDialog = function (width, height, name, uploadSheet, calcName, uploadType, sheetHeaderRows, sheetData) {
  var classDlg = "ExcelUpLoadPopup";
  var themePrefix = this.Style;

  var styles = document.createElement("style");
  styles.innerHTML = '.' + themePrefix + classDlg + 'Outer {' +
    '  padding: 5px ;' +
    '  border: 3px solid #37acff;' +
    '  padding-left: 50px; padding-right: 50px' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Title {' +
    '  width:100%;height:30px;margin-bottom:2px;border-top:1px solid #C3C3C3;padding-top:10px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Title > div:last-child > div:first-child > label {' +
    '  text-align:left !important;font-size:16px;color:#444444;font-family:"NotoSans_Bold"; font-weight:600;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Foot {' +
    '  width:100%;' +
    '  margin-top:10px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Foot ul li {' +
    '  list-style-type : none;' +
    '  height : 32px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Foot label {' +
    '  color : #666666;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Close {' +
    '  background-color: black;' +
    '  width: 17px;' +
    '  height: 17px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head, .' + themePrefix + classDlg + 'Foot {' +
    '  background-color:white;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head .' + themePrefix + classDlg + 'HeadText >div:last-child {' +
    '  text-align: center;' +
    '  color: black;' +
    '  font-size: 25px;' +
    '  margin-bottom: 5px;' +
    '  font-weight: 600;' +
    '  height:35px;' +
    '  line-height: normal;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns {' +
    '  text-align:center;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Outer button:hover {' +
    '  opacity:0.5;' +
    '} ' +

    '.' + themePrefix + classDlg + 'Btns > button {' +
    '  color: #fff;' +
    '  font-family: "NotoSans_Medium";' +
    '  font-size: 18px;' +
    '  display: inline-block;' +
    '  text-align: center;' +
    '  vertical-align: middle;' +
    '  border-radius: 3px;' +
    '  background-color: #37acff;' +
    '  border: 1px solid #37acff;' +
    '  padding: 5px;' +
    '  margin-left: 2px;' +
    '  cursor: pointer;' +
    '}' +
    '.' + name + '_Btn {' +
    '   background-color: white;' +
    '   border: 1px solid gray;' +
    '   border-radius: 3px;' +
    '   cursor: pointer;' +
    '   text-align: center;' +
    '   margin-right: 5px;' +
  '}'+
  '#textSepApply{'+
    'border:1px solid #CCC;'+
    'border-radius: 3px;'+
  '}';

  document.body.appendChild(styles);

  var dialogOpt = {},
    pos = {};
  this.initPopupDialog(dialogOpt, pos, uploadSheet, {
    cssClass: classDlg
  });

  if(sheetData){
    var fullLoadSheetOptArr = [];
    for (var i = 0; i < sheetData.length; i++){
        var fullLoadSheetOpt = "<option value='" + i + "'>" + sheetData[i]["sheetName"] + "</option>";
        fullLoadSheetOptArr.push(fullLoadSheetOpt);
    }
    fullLoadSheetOptArr = fullLoadSheetOptArr.join("");
  }

  dialogOpt.Head = "<div>파일 업로드</div>";
  dialogOpt.Foot = "<div class='" + themePrefix + classDlg + "Btns'>" +
    "  <button id='" + name + "_ExcuteExcelUpLoad'>확인</button>" +
    "  <button id='" + name + "_CancelExcelUpLoad'>취소</button>" +
    "</div>";

  if (uploadType === "excel") {
    dialogOpt.Body = "<div class='" + themePrefix + classDlg + "Title' ><div></div>" +
      "  <div>" +
      "    <div style='float:left;'><label >데이터 미리보기</label></div>" +
      "    <div style='float:right;'><button type='button' id='add_Btn' class='" + name + "_Btn'>행추가</button><button type='button' id='delete_Btn' class='" + name + "_Btn'>행삭제</button><button type='button' id='rule_Btn' class='" + name + "_Btn'>설명보기</button></div>" +
      "  </div>" +
      "</div>" +
      "<div style='width:" + width + "px;display: none;' id='" + name + "dialogRule'>" +
      "   <p>오류건에는 노란색 배경이 입혀집니다. 오류건이 있으면 데이터 로드가 되지 않으므로 삭제하거나 수정 후 사용하시기 바랍니다.</p>" +
      "   <p>업로드 다이얼로그는 mode가 NoHeader로 지정되어있고 헤더행이 없다고 가정하고 첫행부터 순서대로 각 열에 대입합니다.</p>" +
      "   <p>Type이 Int인 경우 숫자 입력이 가능합니다.</p>" +
      "   <p>Type이 Enum인 경우 Enum에 입력한 데이터만 입력이 가능합니다.</p>" +
      "   <p>Type이 Bool인 경우 기본적으로 0과 1만을 사용하고 TrueValue, FalseValue를 사용하여 해당 값들을 변경할 수 있습니다.</p>" +
      "</div>" +
      "<div id='" + name + "_ExcelUpLoadPopupBody' style='width:" + width + "px;height:" + height + "px;overflow:hidden;'></div>";

    if(sheetData && fullLoadSheetOptArr) {
      dialogOpt.Body += "<div class='" + themePrefix + classDlg + "Foot'>" +
        "  <div>" +
        "    <ul class=''>" +
        "      <li>" +
        "        <span style='height:65px;display:inline'>" +
        "          <label for='" + name + "_UploadFileName' style='display:inherit;font-size:15px;'>시트 명</label>" +
        "          <select type='text' id='excelUploadSheet_sheet_UploadSheetName' name='_UploadSheetName' style='display:inherit;margin-left: 3px;font-size:15px;width:75%;text-align:left;height:25px;'>" +
                    fullLoadSheetOptArr +
        "          </select>" +
        "        </span>" +
        "      </li>" +
        "    </ul>" +
        "  </div>" +
        "</div>";
    }
  }

  if (uploadType === "txt" || uploadType === "csv") {
    dialogOpt.Body = "<div class='" + themePrefix + classDlg + "Title' ><div></div>" +
      "  <div>" +
      "    <div style='float:left;'><label >데이터 미리보기</label></div>" +
      "    <div style='float:right;'><button type='button' id='add_Btn' class='" + name + "_Btn'>행추가</button><button type='button' id='delete_Btn' class='" + name + "_Btn'>행삭제</button><button type='button' id='rule_Btn' class='" + name + "_Btn'>설명보기</button></div>" +
      "  </div>" +
      "</div>" +
      "<div style='width:" + width + "px;display: none;' id='" + name + "dialogRule'>" +
      "   <p>오류건에는 노란색 배경이 입혀집니다. 오류건이 있으면 데이터 로드가 되지 않으므로 삭제하거나 수정 후 사용하시기 바랍니다.</p>" +
      "   <p>업로드 다이얼로그는 mode가 NoHeader로 지정되어있고 헤더행이 없다고 가정하고 첫행부터 순서대로 각 열에 대입합니다.</p>" +
      "   <p>Type이 Int인 경우 숫자 입력이 가능합니다.</p>" +
      "   <p>Type이 Enum인 경우 Enum에 입력한 데이터만 입력이 가능합니다.</p>" +
      "   <p>Type이 Bool인 경우 기본적으로 0과 1만을 사용하고 TrueValue, FalseValue를 사용하여 해당 값들을 변경할 수 있습니다.</p>" +
      "   <p>구분자 설정 적용시 다른 구분자로 적용할 경우 시트의 데이터가 올바르게 나오지 않습니다. 입력된 구분자로 적용 하시면 데이터가 올바르게 적용되는 것을 확인 할 수 있습니다.</p>" +
      "</div>" +
      "<div id='" + name + "_ExcelUpLoadPopupBody' style='width:" + width + "px;height:" + height + "px;overflow:hidden;'></div>" +
      "<div class='" + themePrefix + classDlg + "Foot'>" +
      "  <div>" +
      "    <ul class=''>" +
      "      <li>" +
      "          <label for='" + name + "_UploadTextSep' style='font-size:15px;font-weight:bold;'>구분자 설정</label>" +
      "          <select id='" + name + "_UploadTextSep' style='margin-left: 3px;font-size:15px;height:25px;'>" +
      "            <option value=','>,</option>" +
      "            <option value='\\t' selected>Tab</option>" +
      "            <option value='|'>|</option>" +
      "            <option value='.'>.</option>" +
      "            <option value=' '>Space</option>" +
      "          </select>" +
      "          <span style ='float:right;padding-right:109px;'><button id='textSepApply'>적용</button></span>" +
      "      </li>" +
      "    </ul>" +
      "  </div>" +
      "</div>";
  }
  dialogOpt = _IBSheet.showDialog(dialogOpt, pos, this);

  var self = this;
  var excelUpLoadBody = document.getElementById(name + "_ExcelUpLoadPopupBody");
  uploadSheet.MainTag = excelUpLoadBody;

  if (document.getElementById("textSepApply")) {
    var textSepApply = document.getElementById("textSepApply");
    textSepApply.onclick = function () {
      var selectOptsValue = document.getElementById(name + "_UploadTextSep").value;
      var dataRows = uploadSheet.getDataRows();
      var cols = self.getCols();
      var sheetCols = uploadSheet.getCols();
      var data = [];
      var tmpRow = {};
      var startCol = cols.indexOf("SEQ") === 0 ? 1 : 0;

      if (!uploadSheet.OrgLoadTextDataValue) uploadSheet.OrgLoadTextDataValue = [];
      for (var i = 0; i < dataRows.length; i++) {
        tmpRow = {};
        var sepContents = uploadSheet.OrgLoadTextDataValue[i] ? uploadSheet.OrgLoadTextDataValue[i].split(selectOptsValue) : (dataRows[i][sheetCols[startCol + 1]] && dataRows[i][sheetCols[startCol + 1]].split(selectOptsValue));
        if (!uploadSheet.OrgLoadTextDataValue[i]) uploadSheet.OrgLoadTextDataValue[i] = dataRows[i][sheetCols[startCol + 1]];
        for (var j = startCol + 1; j < sheetCols.length; j++) {
          if (j != startCol + 1) uploadSheet.showCol(sheetCols[j]);
          else {
            uploadSheet.Cols[sheetCols[j]].Width = 150;
            uploadSheet.Cols[sheetCols[j]].RelWidth = 0;
          }
          tmpRow[sheetCols[j]] = sepContents[j - 1];
        }
        data.push(tmpRow);
      }
      if (data && data.length) {
        for (var i = 0; i < data.length; i++) {
          data[i]["chkBool"] = (i < sheetHeaderRows.length) ? 0 : 1
        }
      }
      uploadSheet.textSepApply = true;
      uploadSheet.loadSearchData({ data: data });
    }
  }

  var btnUpload = document.getElementById(name + "_ExcuteExcelUpLoad");
  btnUpload.onclick = function () {
    var chkRows = uploadSheet.getRowsByChecked("chkBool");
    if (chkRows && chkRows.length === 0) {
      uploadSheet.showMessageTime("로드할 행을 선택해주세요.");
      return uploadSheet.selectCol("chkBool", 1);
    }

    var data = { data: [] };
    var hr = uploadSheet.Rows.HeadRow;
    var cols = uploadSheet.getCols("Visible");
    for (var i = 0; i < chkRows.length; i++) {
      for (var j = 0; j < cols.length; j++) {
        if (!data.data[i]) data.data[i] = { Added: 1 };
        if (cols[j] != "SEQ" && cols[j] != "chkBool" && chkRows[i][cols[j]] != null) {
          if (!hr[cols[j]]) data.data[i][hr[cols[j]]] = "";
          else {
            if(uploadSheet.Cols[cols[j]].MasterType == "Date" && typeof chkRows[i][cols[j]] == 'number') {
              var stringToDateFormat = "yyyyMMddHHmmss"; 
              var chkRowsVal = chkRows[i][cols[j]] + ""; 
              var stringToDateFormatMap = { 12: "yyyyMMddHHmm", 10: "yyyyMMddHH", 8: "yyyyMMdd" };
              stringToDateFormat = stringToDateFormatMap[chkRowsVal.length] || stringToDateFormat;
              var chkRowsValJSDate = _IBSheet.stringToDate(chkRowsVal, stringToDateFormat);
              var uploadDataFormat = uploadSheet.ParentSheet.Cols[hr[cols[j]]].DataFormat || uploadSheet.ParentSheet.Cols[hr[cols[j]]].Format || "yyyy/mm/dd";
              chkRows[i][cols[j]] = _IBSheet.dateToString(chkRowsValJSDate, uploadDataFormat);
            }

            data.data[i][hr[cols[j]]] = "" + chkRows[i][cols[j]];
          }
        } else {
          data.data[i][hr[cols[j]]] = "";
        }
        if (chkRows[i][cols[j] + "Color"] === "#FFFF00") {
          uploadSheet.showMessageTime("현재 오류건(노란색)이 있습니다. 노란색으로 표시된 부분을 확인 후 삭제 및 수정하시거나 파일을 다시 수정 후 등록하시기 바랍니다.");
          return uploadSheet.startEdit(chkRows[i], cols[j]);
        }
      }
    }

    self.loadSearchData(data);
    uploadSheet.dispose();
    self.closeDialog();
  }

  var btnCancel = document.getElementById(name + "_CancelExcelUpLoad");
  btnCancel.onclick = function () {
    uploadSheet.dispose();
    self.closeDialog();
  }

  var btnAdd = document.getElementById("add_Btn");
  btnAdd.onclick = function () {
    uploadSheet.addRow({ "init": { "chkBool": 0 } });
  }

  var btnDelete = document.getElementById("delete_Btn");
  btnDelete.onclick = function () {
    var chkRows = uploadSheet.getRowsByChecked("chkBool");
    if (chkRows.length == 0) {
      uploadSheet.showMessageTime("삭제할 행을 선택해주세요");
    } else {
      for (var i = 0; i < chkRows.length; i++) {
        uploadSheet.removeRow({ row: chkRows[i] });
      }
    }
  }

  var btnRule = document.getElementById("rule_Btn");
  btnRule.onclick = function () {
    var dialogRule = document.getElementById(name + "dialogRule");
    if (dialogRule.style.display === "none") {
      dialogRule.style.display = "block";
    } else {
      dialogRule.style.display = "none";
    }
  }

  if(sheetData){
    var uploadSheetName = document.getElementById("excelUploadSheet_sheet_UploadSheetName");
    var dialogSheet = uploadSheet; 
    uploadSheetName.onchange = function(){
          dialogSheet.loadSearchData(sheetData[this.value]);
    }
  }
};

Fn.parseFullLoadData = function(data, opt) {
    var replaceEntities = function(v) {
        if (v.indexOf('&#') >= 0) {
            var A = v.match(/\&\#x\w*\;/gi);
            if (A) for (var i = 0; i < A.length; i++) v = v.replace(A[i], String.fromCharCode(parseInt(A[i].slice(3), 16)));
            var A = v.match(/\&\#\w*\;/gi);
            if (A) for (var i = 0; i < A.length; i++) v = v.replace(A[i], String.fromCharCode(parseInt(A[i].slice(2), 10)));
        }
        return v.replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">").replace(/\&quot\;/g, "\"").replace(/\&apos\;/g, "'").replace(/\&amp\;/g, "&");
    };

    if (data) {
        try {
            data = replaceEntities(data);
            data = JSON.parse(data.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t").replace(/\u0000/g,""));

            var name = typeof name == "string" ? name : ("excelUploadSheet_" + this.id);
            
            if (data) {
                var colCount = 20;
                for(var j = 0; j < data["sheetData"].length; j++){
                    if(j == 0) colCount = data["sheetData"][0].maxCol;
                    else if(data["sheetData"][j].maxCol > data["sheetData"][j-1].maxCol) colCount = data["sheetData"][j].maxCol;
                }
                if(colCount > this.getCols()) colCount = colCount - this.getCols().length;

                this.initImportSheet(data["fileType"], Math.abs(700), Math.abs(500), name, Math.abs(colCount), data);
            } else this.ShowAlert(this.GetAlert("LoadExcelError"), "U");
        } catch (e) {
            this.ShowAlert(this.GetAlert("LoadExcelError"), "U");              
        }
    } else {
        this.ShowAlert(this.GetAlert("LoadExcelError"), "U");
    }
};
/*
  엑셀 다운로드 다이얼로그
  showExcelDownloadDialog 호출 시 엑셀 다운로드 다이얼로그를 생성 후 화면에 띄운다.
  다운로드 다이얼로그 인자 추가 - downParams
*/
Fn.showExcelDownloadDialog = function (width, height, name, rowchk, title, downParams) {
  /* step 1 start
   * 현재 시트가 사용 불가능이거나 편집종료되지 못하는 경우 띄우지 않는다.
   */
  if (this.endEdit(true) == -1) return;
  /* step 1 end */

  // 스타일이 중복 되었을때 스타일을 제거한다.
  if (this._stylesExcelDownloadDialog && this._stylesExcelDownloadDialog.parentNode) {
    this._stylesExcelDownloadDialog.parentNode.removeChild(this._stylesExcelDownloadDialog);
    delete this._stylesExcelDownloadDialog;
  }

  var classDlg = "ExcelDownLoadPopup";
  var themePrefix = this.Style;

  if (typeof width == "object") {
    var downTemp = width;
    if (downTemp.width != null) width = downTemp.width;
    if (downTemp.height != null) height = downTemp.height;
    if (downTemp.name != null) name = downTemp.name;
    if (downTemp.rowchk != null) rowchk = downTemp.rowchk;
    if (downTemp.title != null) title = downTemp.title;
    if (downTemp.titleText != null) titleText = downTemp.titleText;
    if (downTemp.userMerge != null) userMerge = downTemp.userMerge;
    if (downTemp.downParams != null) downParams = downTemp.downParams;
  }

  width = typeof width == "number" ? width : 700;
  height = typeof height == "number" ? height : 400;
  name = typeof name == "string" ? name : ("excelDownloadSheet_" + this.id);
  rowchk = typeof rowchk == "number" ? rowchk : 1;
  title = typeof title == "string" ? title : "파일 다운로드";
  // downParma.fileName 인자가 있을 때 다이얼로그에 보여지는 fileName 처리
  if (downParams && downParams.fileName) {
    var fileName = downParams.fileName;
  } else {
    var fileName = _IBSheet.dateToString(new Date(), "yyyy-MM-dd HH:mm") + "_" + (this.Name ? this.Name : this.id);
  }

  var styles = document.createElement("style");
  styles.innerHTML = '.' + themePrefix + classDlg + 'Outer {' +
    '  padding: 5px ;' +
    '  border: 3px solid #37acff;' +
    '  padding-left: 50px; padding-right: 50px' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Title {' +
    '  width:100%;height:30px;margin-bottom:2px;border-top:1px solid #C3C3C3;padding-top:10px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Title > div:last-child > div {' +
    '  float:left!important;width:50%;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Title > div:last-child > div:first-child > label {' +
    '  text-align:left !important;font-size:16px;color:#444444;font-family:"NotoSans_Bold"; font-weight:600;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Foot {' +
    '  width:100%;' +
    '  margin-top:10px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Foot ul li {' +
    '  list-style-type : none;' +
    '  height : 32px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Foot label {' +
    '  color : #666666;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Close {' +
    '  background-color: black;' +
    '  width: 17px;' +
    '  height: 17px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head, .' + themePrefix + classDlg + 'Foot {' +
    '  background-color:white;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head .' + themePrefix + classDlg + 'HeadText >div:last-child {' +
    '  text-align: center;' +
    '  color: black;' +
    '  font-size: 25px;' +
    '  margin-bottom: 5px;' +
    '  font-weight: 600;' +
    '  height:35px;' +
    '  line-height: normal;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns {' +
    '  text-align:center;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns > button {' +
    '  color: #fff;' +
    '  font-family: "NotoSans_Medium";' +
    '  font-size: 18px;' +
    '  display: inline-block;' +
    '  text-align: center;' +
    '  vertical-align: middle;' +
    '  border-radius: 3px;' +
    '  background-color: #37acff;' +
    '  border: 1px solid #37acff;' +
    '  padding: 5px;' +
    '  margin-left: 2px;' +
    '  cursor: pointer;' +
    '}'+
    '.' + themePrefix + classDlg + 'Outer button:hover {' +
    '  opacity: 0.5;' +
    '}';

  document.body.appendChild(styles);

  this._stylesExcelDownloadDialog = styles;

  /* step 2 start
   * 임시로 다운로드 시트가 들어갈 div 생성(생성된 다이얼로그로 아래에서 옮김).
   */
  var tmpSheetTag = document.createElement("div");
  tmpSheetTag.className = "SheetTmpTag";
  tmpSheetTag.style.width = "300px";
  tmpSheetTag.style.height = "100px";
  document.body.appendChild(tmpSheetTag);
  /* step 2 end */

  /* step 3 start
   * 띄워져있는 다이얼로그나 팁을 제거. */
  this.closeDialog();
  this.hideTip();
  /* step 3 end */

  /* step 4 start
   * 다운로드 시트에 대한 옵션 설정(다운로드 시트를 띄운 시트의 옵션을 따라간다.) 및 다운로드 시트 생성
   */
  var opts = this.getUserOptions(1);
  // 시트의 이벤트를 그대로 가져오므로, 이벤트를 삭제 합니다.
  delete opts.Events;

  if (opts.Cfg && opts.Cfg.UsePivot) opts.Cfg.UsePivot = false;
  if (this.InfoRow && this.InfoRow.Visible) {
    if (opts.Cfg) {
      opts.Cfg.InfoRowConfig.Visible = false;
    }
  }

  //부모의 CanEdit가 0이나 3일때
  if (opts.Cfg.CanEdit === 0 || opts.Cfg.CanEdit === 3) {
    opts.Cfg.CanEdit = 1;
    opts.Def = opts.Def || {};
    opts.Def.Col = opts.Def.Col || {};
    opts.Def.Col.CanEdit = 0;
  }

  
  

  // 시트에 Foot과 Solid가 존재하면 제거합니다.
  if (opts.Foot) delete opts.Foot;
  if (opts.Solid) delete opts.Solid;

  if (!opts.Head) opts.Head = [];
  opts.Head.push({
    "id": "downCheckHeader",
    "Kind": "Header",
    "CanEdit": true,
    "RowMerge": false
  });

  // MultiRecord 사용하는 시트에서 엑셀 다운로드 다이얼로그를 사용 할 수 있도록 기능개선
  if (opts.Cfg.MultiRecord == 1) {
    delete opts.Cfg.MultiRecord;
    var tmpCols = opts.Cols;
    opts.Cols = new Array();
    for (var i = 0; i < tmpCols.length; i++) {
      var colsLen = tmpCols[i].length * i;
      for (var j = 0; j < tmpCols[i].length; j++) {
        opts.Cols[j + colsLen] = new Array();
        opts.Cols[j + colsLen] = tmpCols[i][j];
      }
    }
  }

  var self = this;
  var chkHeader = [];
  // rowchk 이 있을 경우 동작되는 작업들.
  if (rowchk) {
    var headerRows = self.getHeaderRows();
    opts.LeftCols = (opts.LeftCols != null) ? opts.LeftCols : [];
    for (var i = 0, j = headerRows; i < j.length; i++) {
      chkHeader[i] = {
        Value: "체크",
        HeaderCheck: 1
      }
    }
    // 다이얼로그 전용 컬럼. LeftCols 가장 앞에 넣는다.
    opts.LeftCols.unshift({
      Header: chkHeader,
      Type: "Bool",
      Name: "chkBool",
      Visible: 1,
      CanEmpty: 3,
      CanEdit: 1,
      ColMerge: 0,
      // NoChanged : 1, 
      Align: "Center",
      VAlign: "Middle"
    });

    opts.Head[opts.Head.length - 1].chkBool = "";

    // downParams.downRows 인자를 사용할 때 chkBool 처리
    if (downParams && downParams.downRows) {
      var chkrows = "|" + downParams.downRows + "|";
    } else {
      var chkrows = "|";
      for (var i = 0, j = self.getDataRows(); i < j.length; i++) {
        chkrows = chkrows + i + "|";
      }
    }

    opts.Events = {
      onDataLoad: function (evtParams) {
        for (var i = 0, j = self.getDataRows(), k = evtParams.sheet.getDataRows(); i < j.length; i++) {
          if (chkrows.indexOf("|" + i + "|") != -1) {
            k[i].chkBool = k[i].Visible = j[i].Visible;
          } else {
            k[i].chkBool = 0;
          }
        }
        evtParams.sheet.syncHeaderCheck();
      }
    }
  }

  // downParams.downCols 인자와 다이얼로그 헤더체크 처리
  // LeftCols, RightCols 에 대한 대응.
  var sec = ["LeftCols", "Cols", "RightCols"];

  // if (!downParams || (downParams && downParams.downCols == "Visible")) {
  if (!downParams || typeof downParams.donwCols == "undefined" ||(downParams && downParams.downCols == "Visible")) {
    var chkcols = "|";
    for (var s = 0; s < sec.length; s++) {
      if (opts[sec[s]]) {
        for (var i = 0; i < opts[sec[s]].length; i++) {
          if (sec[s] == "LeftCols" && opts[sec[s]][i] && opts[sec[s]][i].Name == "chkBool") continue;
          chkcols = chkcols + opts[sec[s]][i].Name + "|";
        }
      }
    }
  } else if (downParams && downParams.downCols) {
    var chkcols = "|" + downParams.downCols + "|";
  }

  var C = this.Cols;

  for (var s = 0; s < sec.length; s++) {
    if (opts[sec[s]]) {
      opts[sec[s]].forEach(function (col) {
        if (sec[s] == "LeftCols" && col && col.Name == "chkBool") return;
        delete col.Required;
        delete col.FormulaRow;
        delete col.RelWidth;
        col.Visible = 1;

        if (downParams && downParams.downCols == "Visible" && C[col.Name] && !C[col.Name].Visible) col.Visible = 0;
        opts.Head[opts.Head.length - 1][col.Name] = {
          Type: "Bool",
          Value: (chkcols.indexOf("|" + col.Name + "|") != -1 && C[col.Name] && C[col.Name].CanExport) ? 1 : 0,
          CanEdit: C[col.Name] && C[col.Name].CanExport ? true : false
        };
      });
    }
  }

  opts.Head[opts.Head.length - 1].SEQ = "선택";

  var DownSheet = _IBSheet.create(name, tmpSheetTag, opts, self.deepCopyRows());
  /* step 4 end */

  /* step 5 start
   * 다운로드 시트가 띄워질 다이얼로그 창에 대한 설정 및 다이얼로그 생성
   */
  var dialogOpt = {},
    pos = {};
  this.initPopupDialog(dialogOpt, pos, DownSheet, {
    cssClass: classDlg
  });

  dialogOpt.Head = "<div>" + title + "</div>";
  dialogOpt.Foot = "<div class='" + themePrefix + classDlg + "Btns'>" +
    "  <button id='" + name + "_ExcuteExcelDownLoad'>다운로드</button>" +
    "  <button id='" + name + "_CancelExcelDownLoad'>취소</button>" +
    "</div>";
  dialogOpt.Body = "<div class='" + themePrefix + classDlg + "Title' ><div></div>" +
    "  <div>" +
    "    <div><label >데이터 미리보기</label></div>" +
    "    <div style='text-align:right;'>" +
    "      <!--<label for='" + name + "_DownloadSelectSave' style='display:inline-block'>다운로드 항목 저장</label>" +
    "      <input type='checkbox' id='" + name + "_DownloadSelectSave' name='DownloadSelectSave' style='display:inline-block'> -->" +
    "    </div>" +
    "  </div>" +
    "</div>" +
    "<div id='" + name + "_ExcelDownPopupBody' style='width:" + width + "px;height:" + height + "px;overflow:hidden;'></div>" +
    "<div class='" + themePrefix + classDlg + "Foot'>" +
    "  <div>" +
    "    <ul class=''>" +
    "      <li>" +
    "        <span>" +
    "          <input type='radio' id='" + name + "_DownloadExcel' name='DownloadType' value='1' checked='checked' style='margin-left:0px;'>" +
    "          <label for='" + name + "_DownloadExcel'>엑셀파일 다운로드</label>" +
    "        </span>" +
    "        <span>" +
    "          <input type='radio' id='" + name + "_DownloadText' name='DownloadType' value='2'>" +
    "          <label for='" + name + "_DownloadText'>텍스트파일 다운로드</label>" +
    "        </span>" +
    "        <span style='margin-left: 15px;display:none'>" +
    "          <label for='" + name + "_DownloadTextSep'>구분자 설정</label>" +
    "          <select id='" + name + "_DownloadTextSep'>" +
    "            <option value=','>,</option>" +
    "            <option value='\t' selected>Tab</option>" +
    "            <option value='|'>|</option>" +
    "            <option value='.'>.</option>" +
    "            <option value=' '>Space</option>" +
    "          </select>" +
    "        </span>" +
    "      </li>" +
    "      <li>" +
    "        <span style='height:65px;display:inline'>" +
    "          <label for='" + name + "_DownloadFileName' style='display:inherit;font-size:15px;font-family:'NotoSans_Bold''>파일 명</label>" +
    "          <input type='text' id='" + name + "_DownloadFileName' name='DownloadFileName' style='display:inherit;margin-left: 3px;font-size:15px;width:75%;text-align:left;height:25px' value='" + fileName + "'>" +
    "        </span>" +
    "      </li>" +
    "    </ul>" +
    "  </div>" +
    "</div>";

  dialogOpt = _IBSheet.showDialog(dialogOpt, pos, this);
  /* step 5 end */

  /* step 6 start
   * 다이얼로그 창의 Body에 다운로드 시트를 옮김
   */
  var ExcelDownDlgBody = document.getElementById(name + "_ExcelDownPopupBody");
  ExcelDownDlgBody.innerHTML = "";
  for (var elem = tmpSheetTag.firstChild; elem; elem = tmpSheetTag.firstChild) ExcelDownDlgBody.appendChild(elem);
  DownSheet.MainTag = ExcelDownDlgBody;
  tmpSheetTag.parentNode.removeChild(tmpSheetTag);
  /* step 6 end */

  /* step 7 start
   * 버튼 클릭시 및 다이얼로그의 시트가 아닌 부분을 클릭했을 때
   */
  var btnDownload = document.getElementById(name + "_ExcuteExcelDownLoad");
  var btnCancel = document.getElementById(name + "_CancelExcelDownLoad");
  var myArea = DownSheet.getElementsByClassName(dialogOpt.Tag, themePrefix + classDlg + "HeadText")[0];

  myArea.onclick = function () {
    if (self.ARow == null) {
      DownSheet.blur();
    }
  }

  var myArea2 = DownSheet.getElementsByClassName(dialogOpt.Tag, themePrefix + classDlg + "Foot")[0]
  myArea2.onclick = function () {
    if (self.ARow == null) {
      DownSheet.blur();
    }
  }

  var txtSep = document.getElementById(name + "_DownloadTextSep");

  btnDownload.onclick = function () {
    var fileName = document.getElementById(name + "_DownloadFileName").value ? document.getElementById(name + "_DownloadFileName").value : "sheet";
    var checkHeader = DownSheet.getRowById("downCheckHeader");
    var cols = DownSheet.getCols();
    var str = cols.filter(function (col) {
      return col === 'SEQ' ? DownSheet.Cols[col].Visible : !(checkHeader[col + "Visible"] == 0 || checkHeader[col + "Type"] != "Bool") && checkHeader[col] === 1 && DownSheet.getAttribute(null, col, "Visible")
    });
    var rows = [];
    var rowStr = "";

    if (rowchk) {
      for (var i = 0, j = cols; i < j.length; i++) {
        if (j[i] == "chkBool") {
          rows = DownSheet.getRowsByChecked("chkBool");
          rowStr = (rows.length == 0) ? "|" : "";
          break;
        }
      }

      for (var i = 0, j = rows; i < j.length; i++) {
        if(j[i].OrgIndex && j[i].Visible) rowStr = rowStr.concat(j[i].OrgIndex, "|");
      }
    }

    if (document.getElementById(name + "_DownloadExcel").checked) {
      try {
        if (fileName.lastIndexOf(".") > -1) {
          var ext = fileName.substring(fileName.lastIndexOf("."));
          if (ext == ".xls") {
            fileName += "x";
          } else if (ext != ".xlsx") {
            fileName += ".xlsx";
          }
        } else {
          fileName += ".xlsx";
        }

        // downParams 인자로 다이얼로그에서 down2Excel의 옵션 사용할 수 있도록 수정
        var paramObj = {
          sheetDesign: 1
        };
        paramObj = IBSheet.__.extend(downParams ? downParams : paramObj, {
          fileName: fileName,
          downRows: rowStr,
          downCols: str.join("|"),
        });

        self.down2Excel(paramObj);
      } catch (e) {
        if (e.message.indexOf("down2Excel is not a function") > -1) {
          console.log("%c 경고", "color:#FF0000", " : ibsheet-excel.js 파일이 필요합니다.");
        }
      }
    } else {
      try {
        self.down2Text({
          fileName: fileName,
          downRows: rowStr,
          downCols: str.join("\|"),
          colDelim: txtSep.value
        });
      } catch (e) {
        if (e.message.indexOf("down2Text is not a function") > -1) {
          console.log("%c 경고", "color:#FF0000", " : ibsheet-excel.js 파일이 필요합니다.");
        }
      }
    }

    DownSheet.dispose();
    self.closeDialog();

    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesExcelDownloadDialog;
    }
  }
  btnCancel.onclick = function () {
    DownSheet.dispose();
    self.closeDialog();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesExcelDownloadDialog;
    }
  }
  /* step 7 end */

  //var txtBtn = document.getElementById(name + "_DownloadText");
  var txtBtn = document.getElementsByName("DownloadType");

  for (var i = 0; i < txtBtn.length; i++) {
    txtBtn[i].onclick = function (ev) {
      if (ev.srcElement.value == "2") {
        txtSep.parentNode.style.display = "inline-block";
      } else {
        txtSep.parentNode.style.display = "none";
      }
    }
  }

  _IBSheet.Focused = DownSheet;
};

// showDownloadDialog로도 호출 가능하게끔 수정.
Fn.showDownloadDialog = Fn.showExcelDownloadDialog;

/*
  엑셀 업로드 다이얼로그
  showUploadDialog 호출 시 엑셀 업로드 다이얼로그를 생성 후 화면에 띄움.
*/
Fn.showUploadDialog = function (uploadType, width, height, name, colCount) {
  var minWidth = 700;
  var minHeight = 400;
  var count = 20;

  if (!uploadType) return false;

  if (this.endEdit(true) == -1) {
    return;
  }

  if (typeof uploadType == "object") {
    var uploadTemp = uploadType;
    if (uploadTemp.uploadType != null) uploadType = uploadTemp.uploadType;
    if (uploadTemp.width != null) width = uploadTemp.width;
    if (uploadTemp.height != null) height = uploadTemp.height;
    if (uploadTemp.name != null) name = uploadTemp.name;
    if (uploadTemp.colCount != null) colCount = uploadTemp.colCount;
  }

  width = parseInt(width);
  if (!width) width = minWidth;
  else if (width < minWidth) width = minWidth;
  height = parseInt(height);
  if (!height) height = minHeight;
  else if (height < minHeight) height = minHeight;
  name = typeof name == "string" ? name : ("excelUploadSheet_" + this.id);
  colCount = parseInt(colCount);
  if (!colCount) colCount = count;

  this.initImportSheet(uploadType, Math.abs(width), Math.abs(height), name, Math.abs(colCount));
};

/* makeSortSheetOpt로 정렬 다이얼로그 내에서 띄워질 시트에 대한 기본 옵션을 설정 */
Fn.makeSortSheetOpt = function (headerIndex, excludeHideCol, useOptions) {
  var cols = [];

  var arr = this.getCols()
  for (var i = 0; i < arr.length; i++) {
    if (excludeHideCol && !this.getAttribute(null, arr[i], "Visible")) continue;
    cols.push(arr[i]);
  }

  var colEnumKeys = '|' + cols.join('|'),
    colEnum,
    header = [],
    headerRows = this.getHeaderRows();

  if (headerIndex != null && typeof headerIndex === 'number' && headerIndex >= 0) {
    if (header.length < headerIndex) headerIndex = headerRows.length - 1;
    for (var j = 0; j < cols.length; j++) {
      var headerString = [];
      if (headerString.indexOf(headerRows[headerIndex][cols[j]]) < 0) headerString.push(headerRows[headerIndex][cols[j]]);
      header.push(headerString.join('/'));
    }
  } else {
    for (var j = 0; j < cols.length; j++) {
      var headerString = [];
      for (var i = 0; i < headerRows.length; i++) {
        if (headerString.indexOf(headerRows[i][cols[j]]) < 0) headerString.push(headerRows[i][cols[j]]);
      }
      header.push(headerString.join('/'));
    }
  }
  colEnum = '|' + header.join('|');

  // 정렬 다이얼로그 옵션
  var option = new Object();
  option.Cfg = {
    "ColorSate": 0,
    "CanColMove": 0,
    "CanSort": 0,
    "CustomScroll": this.CustomScroll,
    "UsePivot": false,
    "DialogSheet": true,
    "InfoRowConfig": {
      "Visible": false
    }
  };

  option.Def = {
    "Row": {
      "CanFormula": 1,
      "CalcOrder": "sExplain"
    },
    "Header": {
      "Menu": { Items: [] },
      "sExplainTip": "가장 상위에 오는 행 부터 정렬 기준이 됩니다.",
      "sTargetTip": "정렬 기준이 될 컬럼(열)을 선택합니다.",
      "sOrderTip": "오름차순/내림차순 정렬 여부를 선택합니다.",
      "sNumberSortTip": "데이터를 숫자형식으로 정렬 할지 여부를 선택합니다.",
      "sRawSortTip": "정렬 데이터에 포맷 적용 여부를 선택합니다.\n콤보 리스트 순서 선택시 콤보 열에 리스트 순서대로 정렬이 됩니다.",
      "sCaseSensitiveTip": "대소문자 구분 여부를 선택합니다.\n체크하는 경우 대소문자를 구분하여 정렬됩니다."
    }
  };

  option.Events = {
    onAfterChange: function (evtParam) {
      var numberType = ["Int", "Float", "Date"],
        val;

      if (evtParam.col == "sTarget") {
        val = evtParam.sheet.ParentSheet.Cols[evtParam.val].NumberSort != null ? evtParam.sheet.ParentSheet.Cols[evtParam.val].NumberSort : (numberType.indexOf(evtParam.sheet.ParentSheet.Cols[evtParam.val].Type) > -1 ? 1 : 0);
        evtParam.sheet.setValue(evtParam.row, 'sNumberSort', val);
        evtParam.sheet.setValue(evtParam.row, 'sRawSort', evtParam.sheet.ParentSheet.Cols[evtParam.val].RawSort != null ? evtParam.sheet.ParentSheet.Cols[evtParam.val].RawSort : 0);
        evtParam.sheet.setValue(evtParam.row, 'sCaseSensitive', evtParam.sheet.ParentSheet.Cols[evtParam.val].CaseSensitive != null ? evtParam.sheet.ParentSheet.Cols[evtParam.val].CaseSensitive : 1);
      }
    }
  }

  option.Cols = [
    {
      "Header": "설명",
      "Type": "Text",
      "Name": "sExplain",
      "Align": "Center",
      "CanEdit": 0,
      "Color": "#EEEEEE",
      "MinWidth": 80,
      "RelWidth": 1,
      "TextStyle": 1,
      "Formula": function (fr) {
        return fr.Row.HasIndex == 1 ? "정렬 기준" : "다음 기준"
      }
    },
    {
      "Header": "기준 컬럼",
      "Type": "Enum",
      "Name": "sTarget",
      "Enum": colEnum,
      "EnumKeys": colEnumKeys,
      "EditFormat": "",
      "RelWidth": 5,
      "MinWidth": 150
    },
    {
      "Header": "정렬",
      "Type": "Enum",
      "Name": "sOrder",
      "Enum": "|오름차순|내림차순",
      "EnumKeys": "|asc|desc",
      "RelWidth": 5,
      "MinWidth": 150
    },
    {
      "Header": "데이터 형식",
      "Type": "Enum",
      "Name": "sNumberSort",
      "Enum": "|문자 형식|숫자 형식",
      "EnumKeys": "|0|1",
      "RelWidth": 5,
      "MinWidth": 150,
      "Visible": useOptions
    },
    {
      "Header": "포맷 적용",
      "Type": "Enum",
      "Name": "sRawSort",
      "Enum": "|포맷 데이터|순수 데이터|콤보 리스트 순서",
      "EnumKeys": "|0|1|2",
      "RelWidth": 5,
      "MinWidth": 150,
      "Visible": useOptions
    },
    {
      "Header": "대/소문자 구분",
      "Type": "Bool",
      "Name": "sCaseSensitive",
      "RelWidth": 5,
      "MinWidth": 150,
      "Visible": useOptions
    }
  ];

  option.Body = [];

  // 기존 소팅 정보 가져오기
  if (!!this.Sort) {
    var Body = [],
      sort = (this.Sort + "").replace(/\s/g, "").split(","),
      obj = {},
      col,
      order,
      numberType = ["Int", "Float", "Date"],
      C = this.Cols;

    for (var i = 0; i < sort.length; i++) {
      obj = {},
      col = sort[i],
      order = 'asc';
      if (col.charAt(0) == '-') {
        col = col.slice(1);
        order = 'desc'
      }

      obj["sTarget"] = col;
      obj["sOrder"] = order
      obj["sNumberSort"] = C[col].NumberSort != null ? C[col].NumberSort : (numberType.indexOf(C[col].Type) > -1 ? 1 : 0);
      obj["sRawSort"] = C[col].RawSort != null ? C[col].RawSort : 0;
      obj["sCaseSensitive"] = C[col].CaseSensitive;
      Body.push(obj);
    }

    option.Body.push(Body);
  }

  return option;
};

/*
  정렬 다이얼로그
  showSortDialog 호출 시 정렬 다이얼로그를 생성 후 화면에 띄운다.
*/
Fn.showSortDialog = function (width, height, headerIndex, name, excludeHideCol, useOptions) {
  /* step 1 start
   * 현재 시트가 정렬 불가능인 경우 띄우지 않는다.
   */
  if (!this.CanSort) return;
  /* step 1 end */

  // 스타일이 중복 되었을때 스타일을 제거한다.
  if (this._stylesSortDialog && this._stylesSortDialog.parentNode) {
    this._stylesSortDialog.parentNode.removeChild(this._stylesSortDialog);
    delete this._stylesSortDialog;
  }

  var classDlg = "SortPopup";
  var themePrefix = this.Style;

  if (width && typeof width == "object") {
    var sortTemp = width;
    if (sortTemp.width != null) width = sortTemp.width;
    if (sortTemp.height != null) height = sortTemp.height;
    if (sortTemp.headerIndex != null) headerIndex = sortTemp.headerIndex;
    if (sortTemp.name != null) name = sortTemp.name;
    if (sortTemp.excludeHideCol != null) excludeHideCol = sortTemp.excludeHideCol;
    if (sortTemp.useOptions != null) useOptions = sortTemp.useOptions;
  }

  width = (typeof width == "number" && width > 600) ? width : 600;
  height = (typeof height == "number" && height > 200) ? height : 200;
  name = typeof name == "string" ? name : ("sortSheet_" + this.id);
  if (useOptions == null) useOptions = 0;

  var styles = document.createElement("style");
  styles.innerHTML = '.' + themePrefix + classDlg + 'Outer {' +
    '  padding: 5px ;' +
    '  border: 3px solid #37acff;' +
    '  padding-left: 50px; padding-right: 50px' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Title {' +
    '  width:100%;height:30px;margin-bottom:2px;border-top:1px solid #C3C3C3;padding-top:10px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Title > div:last-child > div:first-child > label {' +
    '  text-align:left !important;font-size:16px;color:#444444;font-family:"NotoSans_Bold"; font-weight:600;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Body .' + themePrefix + classDlg + 'Foot {' +
    '  width:100%;' +
    '  margin-top:10px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Foot ul li {' +
    '  list-style-type : none;' +
    '  height : 32px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Foot label {' +
    '  color : #666666;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Close {' +
    '  background-color: black;' +
    '  width: 17px;' +
    '  height: 17px;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head, .' + themePrefix + classDlg + 'Foot {' +
    '  background-color:white;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Head .' + themePrefix + classDlg + 'HeadText >div:last-child {' +
    '  text-align: center;' +
    '  color: black;' +
    '  font-size: 25px;' +
    '  margin-bottom: 5px;' +
    '  font-weight: 600;' +
    '  height:35px;' +
    '  line-height: normal;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns {' +
    '  text-align:center;' +
    '} ' +
    '.' + themePrefix + classDlg + 'Btns > button {' +
    '  color: #fff;' +
    '  font-family: "NotoSans_Medium";' +
    '  font-size: 18px;' +
    '  display: inline-block;' +
    '  text-align: center;' +
    '  vertical-align: middle;' +
    '  border-radius: 3px;' +
    '  background-color: #37acff;' +
    '  border: 1px solid #37acff;' +
    '  padding: 5px;' +
    '  margin-left: 2px;' +
    '  cursor: pointer;' +
    '}' +
    '.' + themePrefix + classDlg + 'Outer button:hover {' +
    '  opacity: 0.5;' +
    '}' +
    '.' + name + '_Btn {' +
    '   background-color: white;' +
    '   border: 1px solid gray;' +
    '   cursor: pointer;' +
    '   text-align: center;' +
    '   margin-right: 5px;'
  '}';

  document.body.appendChild(styles);

  this._stylesSortDialog = styles;

  /* step 2 start
   * 임시로 상세보기 시트가 들어갈 div 생성(생성된 다이얼로그로 아래에서 옮김).
   */
  var tmpSheetTag = document.createElement("div");
  tmpSheetTag.className = "SheetTmpTag";
  tmpSheetTag.style.width = "300px";
  tmpSheetTag.style.height = "100px";
  document.body.appendChild(tmpSheetTag);
  /* step 2 end */

  /* step 3 start
   * 띄워져있는 다이얼로그나 팁을 제거.
   */
  this.closeDialog();
  this.hideTip();
  /* step 3 end */

  /* step 4 start
   * 상세보기 시트에 대한 옵션 설정(상세보기 시트를 띄운 시트의 옵션을 따라간다.) 및 상세보기 시트 생성
   */
  var opts = this.makeSortSheetOpt(headerIndex, excludeHideCol, useOptions);
  var SortSheet = _IBSheet.create(name, tmpSheetTag, opts);
  /* step 4 end */

  /* step 5 start
   * 상세보기 시트가 띄워질 다이얼로그 창에 대한 설정 및 다이얼로그 생성
   */
  var dialogOpt = {},
    pos = {};
  this.initPopupDialog(dialogOpt, pos, SortSheet, {
    cssClass: classDlg
  });

  dialogOpt.Head = "<div>정렬 다이얼로그</div>";
  dialogOpt.Body = "<div class='" + themePrefix + classDlg + "Title' >" +
    "  <div>" +
    "    <div style='float:left;'>" +
    "      <button type='button' id='add_Btn' class='" + name + "_Btn'>기준 추가</button>" +
    "      <button type='button' id='remove_Btn' class='" + name + "_Btn'>기준 삭제</button>" +
    "      <button type='button' id='copy_Btn' class='" + name + "_Btn'>기준 복사</button>" +
    "      <button type='button' id='moveup_Btn' class='" + name + "_Btn'>↑</button>" +
    "      <button type='button' id='movedown_Btn' class='" + name + "_Btn'>↓</button>" +
    "    </div>" +
    "  </div>" +
    "  <div>" +
    "    <div style='float:right;'>" +
    "      <button type='button' id='clear_Btn' class='" + name + "_Btn'>기준 전체 삭제</button>" +
    "    </div>" +
    "  </div>" +
    "</div>" +
    "<div id='" + name + "_SortDialogBody' style='width:" + width + "px;height:" + height + "px;overflow:hidden;'></div>";
  dialogOpt.Foot = "<div class='" + themePrefix + classDlg + "Btns'>" +
  "  <button id='" + name + "_InitSortDialog'>초기화</button>" +
  "  <button id='" + name + "_OkSortDialog'>확인</button>" +
  "  <button id='" + name + "_CancelSortDialog'>취소</button>" +
  "</div>";
  dialogOpt = _IBSheet.showDialog(dialogOpt, pos, this);
  /* step 5 end */

  /* step 6 start
   * 다이얼로그 창의 Body에 상세보기 시트를 옮김 */
  var SortDlgBody = document.getElementById(name + "_SortDialogBody");
  SortDlgBody.innerHTML = "";
  for (var elem = tmpSheetTag.firstChild; elem; elem = tmpSheetTag.firstChild) SortDlgBody.appendChild(elem);
  SortSheet.MainTag = SortDlgBody;
  tmpSheetTag.parentNode.removeChild(tmpSheetTag);
  /* step 6 end */

  /* step 7 start
   * 버튼 클릭시 및 다이얼로그의 시트가 아닌 부분을 클릭했을 때
   */
  var myArea = SortSheet.getElementsByClassName(dialogOpt.Tag, themePrefix + classDlg + "HeadText")[0];
  var self = this;
  myArea.onclick = function () {
    if (self.ARow == null) {
      SortSheet.blur();
    }
  }

  var myArea2 = SortSheet.getElementsByClassName(dialogOpt.Tag, themePrefix + classDlg + "Foot")[0]
  myArea2.onclick = function () {
    if (self.ARow == null) {
      SortSheet.blur();
    }
  }

  // 초기화 버튼
  var btnInit = document.getElementById(name + "_InitSortDialog");
  btnInit.onclick = function (ev) {
    var self = SortSheet;
    SortSheet.reloadData({
      func: function () {
        if (self.getFirstVisibleRow()) self.focus(self.getFirstVisibleRow());
      }
    });
    SortSheet.calculate();
    ev.stopPropagation();
    ev.preventDefault();
  }

  // 확인 버튼
  var btnOk = document.getElementById(name + "_OkSortDialog");
  btnOk.onclick = function () {
    SortSheet.endEdit(1);
    var prow = SortSheet.getFirstRow()
      sortInfo = [],
      sortStr = "";
    while (prow) {
      if (!prow["sTarget"]) {
        SortSheet.showMessageTime("모든 정렬 조건에는 지정된 열이 있어야 합니다. 선택한 정렬 조건을 확인하고 다시 시도하십시오.");
        return;
      }

      if (sortInfo.indexOf((prow["sOrder"] == "asc" ? "" : "-") + prow["sTarget"]) > -1) {
        SortSheet.showMessageTime(SortSheet.getString(prow, 'sTarget') + "은(는) 값을 기준으로 두 번 이상 정렬되어 있습니다. 중복된 정렬 조건을 삭제하고 다시 시도하십시오.");
        return;
      }

      sortInfo.push((prow["sOrder"] == "asc" ? "" : "-") + prow["sTarget"]);
      // NumberSort 설정 적용
      self.setAttribute(null, prow['sTarget'], 'NumberSort', parseInt(prow['sNumberSort']));
      self.setAttribute(null, prow['sTarget'], 'RawSort', parseInt(prow['sRawSort']));
      self.setAttribute(null, prow['sTarget'], 'CaseSensitive', parseInt(prow['sCaseSensitive']));

      prow = SortSheet.getNextRow(prow);
    }
    sortStr = sortInfo.join(',');

    !!sortStr ? self.doSort(sortStr) : self.clearSort();
    SortSheet.dispose();
    self.closeDialog();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesSortDialog;
    }
  }

  // 취소 버튼
  var btnCancel = document.getElementById(name + "_CancelSortDialog");
  btnCancel.onclick = function () {
    SortSheet.dispose();
    self.closeDialog();
    // 버튼을 닫을때 스타일을 제거한다.
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
      delete self._stylesSortDialog;
    }
  }

  // 기준 추가 버튼
  var btnAdd = document.getElementById("add_Btn");
  btnAdd.onclick = function () {
    if (self.MaxSort <= SortSheet.getDataRows().length) {
      SortSheet.showMessageTime("해당 시트의 최대 정렬 개수는 " + self.MaxSort + "개 입니다.");
      return;
    }
    SortSheet.addRow({ "init": { "sOrder": "asc" }});
    SortSheet.calculate();
  }

  // 기준 삭제 버튼
  var btnRemove = document.getElementById("remove_Btn");
  btnRemove.onclick = function () {
    var focusRow = SortSheet.getFocusedRow();
    if (focusRow) {
      SortSheet.removeRow({ row: focusRow });
    } else {
      SortSheet.showMessageTime("삭제할 행을 선택해주세요");
    }
    SortSheet.calculate();
  }

  // 기준 복사 버튼
  var btnCopy = document.getElementById("copy_Btn");
  btnCopy.onclick = function () {
    if (self.MaxSort <= SortSheet.getDataRows().length) {
      SortSheet.showMessageTime("해당 시트의 최대 정렬 개수는 " + self.MaxSort + "개 입니다.");
      return;
    }
    var focusRow = SortSheet.getFocusedRow();
    if (focusRow) {
      SortSheet.copyRow({ row: focusRow });
    } else {
      SortSheet.showMessageTime("복사할 행을 선택해주세요");
    }
    SortSheet.calculate();
  }

  // ↑ 버튼
  var btnMoveup = document.getElementById("moveup_Btn");
  btnMoveup.onclick = function () {
    var focusRow = SortSheet.getFocusedRow(),
      targetRow = focusRow ? SortSheet.getPrevRow(focusRow) : null;
    if (focusRow) {
      if (targetRow) SortSheet.moveRow({ row: focusRow, next: targetRow });
    } else {
      SortSheet.showMessageTime("이동할 행을 선택해주세요");
    }
    SortSheet.calculate();
  }

  // ↓ 버튼
  var btnMovedown = document.getElementById("movedown_Btn");
  btnMovedown.onclick = function () {
    var focusRow = SortSheet.getFocusedRow(),
      targetRow = focusRow ? (SortSheet.getNextRow(focusRow) ? SortSheet.getNextRow(SortSheet.getNextRow(focusRow)) : null) : null;

    if (focusRow) {
      SortSheet.moveRow({ row: focusRow, next: targetRow });
    } else {
      SortSheet.showMessageTime("이동할 행을 선택해주세요");
    }
    SortSheet.calculate();
  }

  // 기준 전체 삭제 버튼
  var btnClear = document.getElementById("clear_Btn");
  btnClear.onclick = function () {
    SortSheet.removeAll();
  }
  /* step 7 end */

  _IBSheet.Focused = SortSheet;
};
}(window, document));
