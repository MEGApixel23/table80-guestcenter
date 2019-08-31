$(function ($) {
  'use strict';

  var areaSpinal = "#apex-area-spinal";
  var timeSeries = "#apex-time-series";
  var lineChart = "#apex-line-chart";
  var lineChartMultiple = "#apex-line-chart-multiple";
  var groupedBarChart = "#apex-grouped-bar-chart";
  var stackedBarChart = "#apex-stacked-bar-chart";
  var pieChart = "#apex-pie-chart";
  var donutChart = "#apex-donut-chart";

  if ($(areaSpinal).length) {
    'use strict';
    var options = {
      chart: {
        height: 380,
        type: 'area',
        toolbar: {
          show: false,
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: chartColors,
      series: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
      }, {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41]
      }],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        show: true,
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      legend: {
        position: 'bottom',
        verticalAlign: 'top',
        offsetX: 0,
        offsetY: -15
      },
      tooltip: {
        fixed: {
          enabled: false,
          position: 'topRight'
        }
      }
    }

    var chart = new ApexCharts(
      document.querySelector(areaSpinal),
      options
    );

    chart.render();
  }

  if ($(timeSeries).length) {
    'use strict';
    var ts1 = 1388534400000;
    var ts2 = 1388620800000;
    var ts3 = 1389052800000;

    var dataSet = [
      [],
      [],
      []
    ];

    for (var i = 0; i < 12; i++) {
      ts1 = ts1 + 86400000;
      var innerArr = [ts1, dataSeries[2][i].value];
      dataSet[0].push(innerArr)
    }
    for (var i = 0; i < 18; i++) {
      ts2 = ts2 + 86400000;
      var innerArr = [ts2, dataSeries[1][i].value];
      dataSet[1].push(innerArr)
    }
    for (var i = 0; i < 12; i++) {
      ts3 = ts3 + 86400000;
      var innerArr = [ts3, dataSeries[0][i].value];
      dataSet[2].push(innerArr)
    }

    var options = {
      chart: {
        type: 'area',
        stacked: false,
        height: 380,
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        }
      },
      plotOptions: {
        line: {
          curve: 'smooth',
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: chartColors,
      series: [{
        name: 'PRODUCT A',
        data: dataSet[0]
      }, {
        name: 'PRODUCT B',
        data: dataSet[1]
      }, {
        name: 'PRODUCT C',
        data: dataSet[2]
      }],
      markers: {
        size: 0,
        style: 'full',
      },
      fill: {
        gradient: {
          enabled: true,
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100, 100, 100]
        },
      },
      xaxis: {
        type: 'datetime',
        show: true,
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: false,
        labels: {
          style: {
            color: '#8e8da4',
          },
          offsetX: 0,
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false
        }
      },
      legend: {
        position: 'bottom',
        verticalAlign: 'top',
        offsetX: 0,
        offsetY: -15
      },
      tooltip: {
        shared: true,
        y: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0) + " points"
          }
        }
      }
    }

    var chart = new ApexCharts(
      document.querySelector(timeSeries),
      options
    );

    chart.render();
  }

  if ($(lineChart).length) {
    'use strict';
    var options = {
      chart: {
        height: 380,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: chartColors,
      series: [{
          name: "Mobile",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320]
        },
        {
          name: "Desktops",
          data: [233, 423, 352, 272, 432, 224, 107, 133, 458, 229]
        }
      ],
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      labels: series.monthDataSeries1.dates,
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
      yaxis: {
        show: false
      },
      legend: {
        position: 'bottom',
        verticalAlign: 'top',
        offsetX: 0,
        offsetY: -15
      }
    }

    var chart = new ApexCharts(
      document.querySelector(lineChart),
      options
    );

    chart.render();
  }

  if ($(lineChartMultiple).length) {
    'use strict';
    var options = {
      chart: {
        height: 380,
        type: 'line',
        zoom: {
          enabled: false
        },
        animations: {
          enabled: false
        },
        toolbar: {
          show: false,
        }
      },
      stroke: {
        width: [5, 5, 4],
        curve: 'straight'
      },
      legend: {
        position: 'bottom',
        verticalAlign: 'top',
        offsetX: 0,
        offsetY: -15
      },
      colors: chartColors,
      series: [{
        name: 'Peter',
        data: [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9]
      }, {
        name: 'Johnny',
        data: [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null]
      }, {
        name: 'David',
        data: [null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null, null, null]
      }],
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      yaxis: {
        show: false
      }
    }

    var chart = new ApexCharts(
      document.querySelector(lineChartMultiple),
      options
    );

    chart.render();
  }

  if ($(groupedBarChart).length) {
    'use strict';
    var options = {
      chart: {
        height: 380,
        type: 'bar',
        toolbar: {
          show: false,
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: 'rounded',
          columnWidth: '55%',
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      colors: chartColors,
      series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58]
      }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105]
      }, {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48]
      }],
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      },
      yaxis: {
        show: false
      },
      fill: {
        opacity: 1

      },
      legend: {
        position: 'bottom',
        verticalAlign: 'top',
        offsetX: 0,
        offsetY: -15
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands"
          }
        }
      }
    }

    var chart = new ApexCharts(
      document.querySelector(groupedBarChart),
      options
    );

    chart.render();
  }

  if ($(stackedBarChart).length) {
    'use strict';
    var options = {
      chart: {
        height: 380,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      colors: chartColors,
      series: [{
        name: 'PRODUCT A',
        data: [44, 55, 41, 67, 22, 43, 21]
      }, {
        name: 'PRODUCT B',
        data: [13, 23, 20, 8, 13, 27, 33]
      }, {
        name: 'PRODUCT C',
        data: [11, 17, 15, 15, 21, 14, 15]
      }],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        show: true,
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      legend: {
        position: 'bottom',
        verticalAlign: 'top',
        offsetX: 0,
        offsetY: -15
      },
      fill: {
        opacity: 1
      }
    }

    var chart = new ApexCharts(
      document.querySelector(stackedBarChart),
      options
    );

    chart.render();
  }

  if ($(pieChart).length) {
    'use strict';
    var options = {
      chart: {
        width: 380,
        type: 'pie',
        toolbar: {
          show: false,
        }
      },
      legend: {
        position: 'bottom',
        verticalAlign: 'top',
        offsetX: 0,
        offsetY: -15
      },
      colors: chartColors,
      series: [44, 25, 46]
    }

    var chart = new ApexCharts(
      document.querySelector(pieChart),
      options
    );

    chart.render();
  }

  if ($(donutChart).length) {
    'use strict';
    var options = {
      chart: {
        width: 380,
        type: 'donut',
        toolbar: {
          show: false,
        }
      },
      legend: {
        position: 'bottom',
        verticalAlign: 'top',
        offsetX: 0,
        offsetY: -15
      },
      colors: chartColors,
      series: [44, 67, 11]
    }

    var chart = new ApexCharts(
      document.querySelector(donutChart),
      options
    );

    chart.render();
  }

});