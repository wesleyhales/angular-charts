angular.module('myApp.services', [], function($provide){

    $provide.factory('chartService',function(){

  var
    areaChart,
    barChart,
    pieChart,
    pieCompare,
    xaxis,
    seriesIndex;

  return {
    convertLineChart: function (chartData, chartTemplate, dataDescription, settings) {

      var seriesCount = chartData.length,
        label;

      var lineChart = chartTemplate;
      seriesIndex = 0;
      lineChart.series = [];
      label = '';
      xaxis = lineChart.xAxis[0];


      //the next 2 setting options are provided in the timeFormat dropdown, so we must inspect them here
      if (settings.xaxisformat) {
        xaxis.labels.formatter = new Function(settings.xaxisformat);
      }
      if (settings.step) {
        xaxis.labels.step = settings.step;
      }
      //end check

      //check to see if there are multiple "chartGroupNames" in the object, otherwise "NA" will go to the else
      if(chartData.length > 1){

        for (var l = 0; l < chartData.length; l++){

          chartData.sort(function(a, b){
            a = a['label'].toLowerCase();
            b = b['label'].toLowerCase();
            if(a === 'agree'){
              return -1;
            }else if(b === 'agree'){
              return 1;
            }else if(a === 'disagree'){
                return -1;
              }else if(b === 'disagree'){
                return 1;
            }else{
              return a > b ? 1 : a < b ? -1 : 0;
            }

          });

            var dataPoints = chartData[l].datapoints;

            lineChart.series[l] = {};
            lineChart.series[l].data = [];
            lineChart.series[l].name = chartData[l].label;
            lineChart.series[l].type = 'line';
            lineChart.series[l].color = dataDescription.colors[l];
            lineChart.series[l].dashStyle = 'solid';

            lineChart.yAxis[0].title.text = dataDescription.yAxisLabels;



            for (var i = 0; i < dataPoints.length; i++) {
              if(typeof dataDescription.dataAttr[1] === 'object'){
                  lineChart.series[l].data.push([dataPoints[i].timestamp,dataPoints[i].count]);
              }

            }

          }

      }


      return lineChart;
    },

    convertAreaChart: function (chartData, chartTemplate, dataDescription, settings, currentCompare) {

      areaChart = angular.copy(areaChart);
//      console.log('chartData',chartData[0])
      if (typeof chartData[0] === 'undefined') {
        chartData[0] = {};
        chartData[0].datapoints = []
      }
      var dataPoints = chartData[0].datapoints,
        dPLength = dataPoints.length,
        label;


    areaChart = chartTemplate;

    seriesIndex = 0;
    areaChart.series = [];
    label = '';

      xaxis = areaChart.xAxis[0];
      xaxis.categories = [];



      //the next 2 setting options are provided in the timeFormat dropdown, so we must inspect them here
      if (settings.xaxisformat) {
        xaxis.labels.formatter = new Function(settings.xaxisformat);
      }
      if (settings.step) {
        xaxis.labels.step = settings.step;
      }
      //end check

      for (var i = 0; i < dPLength; i++) {
        var dp = dataPoints[i];
        xaxis.categories.push(dp.timestamp);
      }

      //check to see if there are multiple "chartGroupNames" in the object, otherwise "NA" will go to the else
      if(chartData.length > 1){

        for (var l = 0; l < chartData.length; l++){

//          if(chartData[l].chartGroupName){

            dataPoints = chartData[l].datapoints;
//            dPLength = dataPoints.length;

            areaChart.series[l] = {};
            areaChart.series[l].data = [];
            areaChart.series[l].fillColor = dataDescription.areaColors[l];
            areaChart.series[l].name = chartData[l].chartGroupName;
            areaChart.series[l].yAxis = 0;
            areaChart.series[l].type = 'area';
            areaChart.series[l].pointInterval = 1;
            areaChart.series[l].color = dataDescription.colors[l];
            areaChart.series[l].dashStyle = 'solid';

            areaChart.yAxis[0].title.text = dataDescription.yAxisLabels;

            plotData(l,dPLength,dataPoints,dataDescription.detailDataAttr,true)
          }
//        }
      }else{

        var steadyCounter = 0;

        //loop over incoming data members for axis setup... create empty arrays and settings ahead of time
        //the seriesIndex is for the upcoming compare options - if compare is clicked... if it isn't just use 0 :/
        for (var i = seriesIndex;i < (dataDescription.dataAttr.length + (seriesIndex > 0 ? seriesIndex : 0)); i++) {
          var yAxisIndex = dataDescription.multiAxis ? steadyCounter : 0;
          areaChart.series[i] = {};
          areaChart.series[i].data = [];
          areaChart.series[i].fillColor = dataDescription.areaColors[i];
          areaChart.series[i].name = label + dataDescription.labels[steadyCounter];
          areaChart.series[i].yAxis = yAxisIndex;
          areaChart.series[i].type = 'area';
          areaChart.series[i].pointInterval = 1;
          areaChart.series[i].color = dataDescription.colors[i];
          areaChart.series[i].dashStyle = 'solid';

          areaChart.yAxis[yAxisIndex].title.text = dataDescription.yAxisLabels[(dataDescription.yAxisLabels > 1 ? steadyCounter : 0)];
          steadyCounter++;
        }

        plotData(seriesIndex,dPLength,dataPoints,dataDescription.dataAttr,false)
      }

      function plotData(counter,dPLength,dataPoints,dataAttrs,detailedView){
        //massage the data... happy ending
        for (var i = 0; i < dPLength; i++) {
          var dp = dataPoints[i];

          var localCounter = counter;
          //loop over incoming data members
          for (var j = 0; j < dataAttrs.length; j++) {
            if(typeof dp === 'undefined'){
              areaChart.series[localCounter].data.push(0);
            }else{
              areaChart.series[localCounter].data.push(dp[dataAttrs[j]]);
            }
            if(!detailedView){
              localCounter++;
            }

          }

        }
      }
      return areaChart;
    },

    convertBarChart: function (chartData, chartTemplate, dataDescription, settings, currentCompare) {

      if (typeof chartData === 'undefined') {
        chartData = [];
      }

      var label,
        cdLength = chartData.length,
        compare = false,
        allBarOptions = [],
        stackedBar = false;


      barChart = chartTemplate;
      seriesIndex = 0;

      function getPreviousData(){
        for(var i = 0;i < chartTemplate.series[0].data.length;i++){
          //pulling the "now" values for comparison later, assuming they will be in the 0 index :)
          allBarOptions.push(chartTemplate.xAxis.categories[i])
        }
      }

      if(typeof dataDescription.dataAttr[1] === 'object'){
        stackedBar = true;
      }

      if(currentCompare === 'YESTERDAY'){
        label = 'Yesterday ';
        compare = true;
        if(stackedBar){
          seriesIndex = dataDescription.dataAttr[1].length;
        }
        getPreviousData()
      }
      else if(currentCompare === 'LAST_WEEK'){
        label = 'Last Week ';
        compare = true;
        if(stackedBar){
          seriesIndex = dataDescription.dataAttr[1].length;
        }
        seriesIndex =
          getPreviousData()
      }else{
        compare = false;
        label = '';
        barChart.xAxis.categories = [];
        barChart.series = [];
        barChart.series[0] = {};
        barChart.series[0].data = [];
        barChart.legend.enabled = false;
      }

      barChart.plotOptions.series.borderColor = dataDescription.borderColor;


      //create a basic compare series (more advanced needed for stacked bar)
      if(compare && !stackedBar){
        barChart.series[1] = {};
        barChart.series[1].data = [];
        //repopulate array with 0 values based on length of NOW data
        for(var i = 0; i < allBarOptions.length; i++) {
          barChart.series[1].data.push(0);
        }
        barChart.legend.enabled = true;
//        barChart.series[1].name = label;
//        barChart.series[0].name = "Now";
      }

      for (var i = 0; i < cdLength; i++) {
        var bar = chartData[i];

        if(!compare){
          barChart.xAxis.categories.push(bar[dataDescription.dataAttr[0]]);

          //if we send multiple attributes to be plotted, assume it's a stacked bar for now
          if(typeof dataDescription.dataAttr[1] === 'object'){
            createStackedBar(dataDescription,barChart,barChart.series.length);
          }else{
            barChart.series[0].data.push(bar[dataDescription.dataAttr[1]]);
            barChart.series[0].name = dataDescription.labels[0];
            barChart.series[0].color = dataDescription.colors[0];
          }

        }else{

          //check if this is a stacked bar


          var newLabel = bar[dataDescription.dataAttr[0]],
            newValue = bar[dataDescription.dataAttr[1]],
            previousIndex = allBarOptions.indexOf(newLabel);

          //make sure this label existed in the NOW data
          if(previousIndex > -1){
            if(typeof dataDescription.dataAttr[1] === 'object'){
              createStackedBar(dataDescription,barChart,barChart.series.length);
            }else{
              barChart.series[1].data[previousIndex] = newValue;
              barChart.series[1].name = (label !== '' ? label + ' ' + dataDescription.labels[0] : dataDescription.labels[0]);
              barChart.series[1].color = dataDescription.colors[1];
            }
          }else{
            //not found for comparison
          }


        }

      }

      function createStackedBar(dataDescription,barChart,startingPoint){

        barChart.plotOptions = {
          series: {
            shadow: false,
            borderColor: dataDescription.borderColor,
            borderWidth: 1
          },
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
            }
          }
        };

        var start = dataDescription.dataAttr[1].length,
          steadyCounter = 0;
        stackName = label;

        if(compare){
          barChart.legend.enabled = true;
        }

        for (var f = seriesIndex; f < (start + seriesIndex); f++) {
          if(!barChart.series[f]){
            barChart.series[f] = {'data':[]}
          }
          barChart.series[f].data.push(bar[dataDescription.dataAttr[1][steadyCounter]]);
          barChart.series[f].name = (label !== '' ? label + ' ' + dataDescription.labels[steadyCounter] : dataDescription.labels[steadyCounter]);
          barChart.series[f].color = dataDescription.colors[f];
          barChart.series[f].stack = label;
          steadyCounter++
        }


      }

      return barChart;
    },

    convertPieChart: function (chartData, chartTemplate, dataDescription, settings) {

      var label,
        cdLength = chartData.length,
        compare = false;

      pieChart = chartTemplate;


        compare = false;

        pieChart.series[0].data = [];

        if (pieChart.series[0].dataLabels) {
          if(typeof pieChart.series[0].dataLabels.formatter === 'string'){
            pieChart.series[0].dataLabels.formatter = new Function(pieChart.series[0].dataLabels.formatter);
          }
        }

      pieChart.plotOptions.pie.borderColor = dataDescription.borderColor;

      var tempArray = [];
      for (var i = 0; i < cdLength; i++) {
        var pie = chartData[i];

        tempArray.push({
          name:pie[dataDescription.dataAttr[0]],
          y:pie.datapoints[pie.datapoints.length-1][dataDescription.dataAttr[1][1]],
          color:''
        });

      }

      tempArray.sort(function(a, b){
        a = a['name'].toLowerCase();
        b = b['name'].toLowerCase();
        return a > b ? 1 : a < b ? -1 : 0;
      });

      //add colors so they match up
      for (var i = 0; i < tempArray.length; i++) {
        tempArray[i].color = dataDescription.colors[i];
      }


      pieChart.series[0].data = tempArray;


      return pieChart;
    }
  };


    })

})