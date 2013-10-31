'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('PageCtrl', ['$scope', 'pageService', 'chartService', function ($scope, pageService, chartService) {

    if (!$scope.chartTemplate) {
      //get the chart template for this view... right now it covers all charts...
      pageService.get(null, 'charts/highcharts.json').then(function (success) {
        $scope.chartTemplate = success;
        $scope.createCharts();
      }, function (fail) {
        console.log('Problem getting chart template', fail)
      });
    } else {
      $scope.createCharts();
    }

    $scope.createCharts = function () {

      var dataDescription = {
        timeseries: {
          yAxisLabels: [''],
          labels: ['Total'],
          dataAttr: ['label', ['timestamp', 'count']],
          detailDataAttr: ['count'],
          colors: ['rgba(43,166,203,0.9)',
            'rgba(52,52,52,0.3)',
            'rgba(169,234,181,0.9)',
            'rgba(43,43,43,0.5)'],
          borderColor: '#1b97d1',
          areaColors: ['rgba(43,166,203,0.9)',
            'rgba(52,52,52,0.3)',
            'rgba(169,234,181,0.9)',
            'rgba(43,43,43,0.5)']
        },
        pie: {
          dataAttr: ['label', ['timestamp', 'count']],
          colors: [
            'rgba(43,166,203,0.4)',
            'rgba(52,52,52,0.3)',
            'rgba(169,234,181,0.5)',
            'rgba(43,43,43,0.5)',
            '#ff9191', '#ffa1a1', '#ffb6b6', '#ffcbcb'],
          borderColor: '#ff0303'
        },
        bar: {
          labels: ['barexample'],
          dataAttr: ['label', 'value'],
          colors: [createGradient('rgba(43,166,203,0.9)', 'rgba(43,166,203,0.4)')],
          borderColor: 'rgba(43,166,203,1)'
        }
      };

      var pieChartData = [
        {
          label: 'test1',
          datapoints: [
            {
              timestamp: 1383230753238,
              count: 50
            }
          ]
        },
        {
          label: 'test2',
          datapoints: [
            {
              timestamp: 1383230753238,
              count: 60
            }
          ]
        },
        {
          label: 'test3',
          datapoints: [
            {
              timestamp: 1383230753238,
              count: 60
            }
          ]
        }

      ]

      var lineChartData = [
        {
          label: 'test1',
          datapoints: [
            {
              timestamp: 1383230753238,
              count: 50
            },
            {
              timestamp: 1383230784165,
              count: 60
            },
            {
              timestamp: 1383230821680,
              count: 170
            }
          ]
        },
        {
          label: 'test2',
          datapoints: [
            {
              timestamp: 1383230753238,
              count: 70
            },
            {
              timestamp: 1383230784165,
              count: 180
            },
            {
              timestamp: 1383230821680,
              count: 90
            }
          ]
        },
        {
          label: 'test3',
          datapoints: [
            {
              timestamp: 1383230753238,
              count: 190
            },
            {
              timestamp: 1383230784165,
              count: 100
            },
            {
              timestamp: 1383230821680,
              count: 110
            }
          ]
        }
      ]

      var barChartData = [
        {label: 'total1', value: 2},
        {label: 'total2', value: 14},
        {label: 'total3', value: 8},
        {label: 'total4', value: 4},
        {label: 'total5', value: 22}
      ]

      var tempPieChart = angular.copy($scope.chartTemplate.pie);
      var tempLineChart = angular.copy($scope.chartTemplate.line);
      var tempAreaChart = angular.copy($scope.chartTemplate.area);
      var tempBarChart = angular.copy($scope.chartTemplate.bar);

      $scope.pieChartData = chartService.convertPieChart(pieChartData, tempPieChart, dataDescription.pie, '')
      $scope.lineChartData = chartService.convertLineChart(lineChartData, tempLineChart, dataDescription.timeseries, '');
      $scope.areaChartData = chartService.convertAreaChart(lineChartData, tempAreaChart, dataDescription.timeseries, '');
      $scope.barChartData = chartService.convertBarChart(barChartData, tempBarChart, dataDescription.bar, '');

    }

    function createGradient(color1, color2) {
      var perShapeGradient = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 1
      };
      return {
        linearGradient: perShapeGradient,
        stops: [
          [0, color1],
          [1, color2]
        ]
      }
    }


  }]);