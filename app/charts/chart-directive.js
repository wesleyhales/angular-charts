'use strict';

angular.module('myApp.directives', []).
  directive('chart', [function () {

    return {
      restrict: 'E',
      scope: {
        chartdata: '=chartdata'
      },
      template: '<div></div>',
      replace: true,
      controller: function ($scope, $element) {


      },
      link: function (scope, element, attrs) {

        scope.$watch('chartdata', function (chartdata, oldchartdata) {

          if (chartdata) {
            //set chart defaults through tag attributes
            var chartsDefaults = {
              chart: {
                renderTo: element[0],
                type: attrs.type || null,
                height: attrs.height || null,
                width: attrs.width || null,
                reflow: true,
                animation: false,
                zoomType: 'x'
//              events: {
//                redraw: resize,
//                load: resize
//              }
              }
            }

            if (attrs.type === 'pie') {
              chartsDefaults.chart.margin = [0, 0, 0, 0];
              chartsDefaults.chart.spacingLeft = 0;
              chartsDefaults.chart.spacingRight = 0;
              chartsDefaults.chart.spacingTop = 0;
              chartsDefaults.chart.spacingBottom = 0;

              if (attrs.titleimage) {
                chartdata.title.text = '<img src=\"' + attrs.titleimage + '\">';
              }

              if (attrs.titleicon) {
                chartdata.title.text = '<i class=\"pictogram title\">' + attrs.titleicon + '</i>';
              }

              if (attrs.titlecolor) {
                chartdata.title.style.color = attrs.titlecolor;
              }

              if (attrs.titleimagetop) {
                chartdata.title.style.marginTop = attrs.titleimagetop;
              }

              if (attrs.titleimageleft) {
                chartdata.title.style.marginLeft = attrs.titleimageleft;
              }

            }

            if (attrs.type === 'line') {
              chartsDefaults.chart.marginTop = 30;
              chartsDefaults.chart.spacingTop = 50;
//            chartsDefaults.chart.zoomType = null;
            }

            if (attrs.type === 'bar') {
              chartsDefaults.chart.marginBottom = 80;
              chartsDefaults.chart.defaultSeriesType = 'column';
//            chartsDefaults.chart.spacingBottom = 50;
//            chartsDefaults.chart.zoomType = null;
            }

            if (attrs.type === 'area') {
              chartsDefaults.chart.spacingLeft = 0;
              chartsDefaults.chart.spacingRight = 0;
              chartsDefaults.chart.marginLeft = 0;
              chartsDefaults.chart.marginRight = 0;
            }

            Highcharts.setOptions({
              global: {
                useUTC: false
              },
              chart: {
                style: {
                  fontFamily: 'Lato, Helvetica, Arial, sans-serif'
                }
              }
            });


            if (attrs.type === 'line' || attrs.type === 'area') {
              var xAxis1 = chartdata.xAxis[0];

              //check for previous setting from service layer or json template... if it doesn't exist use the attr value
              if (!xAxis1.labels.formatter) {
                xAxis1.labels.formatter = new Function(attrs.xaxislabel);
              }
              if (!xAxis1.labels.step) {
                xAxis1.labels.step = attrs.xaxisstep;
              }
              //end check
            }

            //pull any stringified from template JS and eval it
            if (chartdata.tooltip) {
              if (typeof chartdata.tooltip.formatter === 'string') {
                chartdata.tooltip.formatter = new Function(chartdata.tooltip.formatter);
              }
//            chartdata.tooltip.shared = true;
            }


            renderChart(chartsDefaults, chartdata);
          }

        });

      }
    };

  }]);


function renderChart(chartsDefaults, chartdata, attrs) {
  angular.extend(chartsDefaults, chartdata);
  new Highcharts.Chart(chartsDefaults);
}