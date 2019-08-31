$(function () {
  'use strict';

  if ($("#chartist-line-chart").length) {
    new Chartist.Line('#chartist-line-chart', {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      series: [
        [12, 9, 7, 8, 5],
        [2, 1, 3.5, 7, 3],
        [1, 3, 4, 5, 6]
      ]
    }, {
      fullWidth: true,
      chartPadding: {
        right: 40
      }
    });
  }

  if ($("#chartist-holes-in-data").length) {
    var chart = new Chartist.Line('#chartist-holes-in-data', {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      series: [
        [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9],
        [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null],
        [null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null, null, null],
        [{
          x: 3,
          y: 3
        }, {
          x: 4,
          y: 3
        }, {
          x: 5,
          y: undefined
        }, {
          x: 6,
          y: 4
        }, {
          x: 7,
          y: null
        }, {
          x: 8,
          y: 4
        }, {
          x: 9,
          y: 4
        }]
      ]
    }, {
      fullWidth: true,
      chartPadding: {
        right: 10
      },
      low: 0
    });
  }

  if ($("#chartist-filled-holes-in-data").length) {
    var chart = new Chartist.Line('#chartist-filled-holes-in-data', {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      series: [
        [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9],
        [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null],
        [null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null, null, null],
        [{
          x: 3,
          y: 3
        }, {
          x: 4,
          y: 3
        }, {
          x: 5,
          y: undefined
        }, {
          x: 6,
          y: 4
        }, {
          x: 7,
          y: null
        }, {
          x: 8,
          y: 4
        }, {
          x: 9,
          y: 4
        }]
      ]
    }, {
      fullWidth: true,
      chartPadding: {
        right: 10
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        fillHoles: true,
      }),
      low: 0
    });
  }

  if ($("#chartist-scatter-diagram").length) {
    var times = function (n) {
      return Array.apply(null, new Array(n));
    };

    var data = times(52).map(Math.random).reduce(function (data, rnd, index) {
      data.labels.push(index + 1);
      data.series.forEach(function (series) {
        series.push(Math.random() * 100)
      });

      return data;
    }, {
      labels: [],
      series: times(4).map(function () {
        return new Array()
      })
    });
    var options = {
      showLine: false,
      axisX: {
        labelInterpolationFnc: function (value, index) {
          return index % 13 === 0 ? 'W' + value : null;
        }
      }
    };

    var responsiveOptions = [
      ['screen and (min-width: 640px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 4 === 0 ? 'W' + value : null;
          }
        }
      }]
    ];

    new Chartist.Line('#chartist-scatter-diagram', data, options, responsiveOptions);
  }

  if ($("#chartist-line-with-area").length) {
    new Chartist.Line('#chartist-line-with-area', {
      labels: [1, 2, 3, 4, 5, 6, 7, 8],
      series: [
        [5, 9, 7, 8, 5, 3, 5, 4]
      ]
    }, {
      low: 0,
      showArea: true
    });
  }

  if ($("#chartist-bi-polar").length) {
    new Chartist.Line('#chartist-bi-polar', {
      labels: [1, 2, 3, 4, 5, 6, 7, 8],
      series: [
        [1, 2, 3, 1, -2, 0, 1, 0],
        [-2, -1, -2, -1, -2.5, -1, -2, -1],
        [0, 0, 0, 1, 2, 2.5, 2, 1],
        [2.5, 2, 1, 0.5, 1, 0.5, -1, -2.5]
      ]
    }, {
      high: 3,
      low: -3,
      showArea: true,
      showLine: false,
      showPoint: false,
      fullWidth: true,
      axisX: {
        showLabel: false,
        showGrid: false
      }
    });
  }

  if ($("#chartist-bi-polar-bar").length) {
    var data = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    };

    var options = {
      high: 10,
      low: -10,
      axisX: {
        labelInterpolationFnc: function (value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
    };

    new Chartist.Bar('#chartist-bi-polar-bar', data, options);
  }

  if ($("#chartist-bi-polar-bar").length) {
    var data = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    };

    var options = {
      high: 10,
      low: -10,
      axisX: {
        labelInterpolationFnc: function (value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
    };

    new Chartist.Bar('#chartist-bi-polar-bar', data, options);
  }

  if ($("#chartist-bar-chart").length) {
    var data = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, 2, 1, 4, 6, 2]
      ]
    };

    var options = {
      high: 10,
      low: 0,
      axisX: {
        labelInterpolationFnc: function (value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
    };

    new Chartist.Bar('#chartist-bar-chart', data, options);
  }

  if ($("#chartist-overlapping-bar-chart").length) {
    var data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        [5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
        [3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
      ]
    };
    var options = {
      seriesBarDistance: 10
    };
    var responsiveOptions = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    new Chartist.Bar('#chartist-overlapping-bar-chart', data, options, responsiveOptions);
  }

  if ($("#chartist-stacked-bar-chart").length) {
    new Chartist.Bar('#chartist-stacked-bar-chart', {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      series: [
        [800000, 1200000, 1400000, 1300000],
        [200000, 400000, 500000, 300000],
        [100000, 200000, 400000, 600000]
      ]
    }, {
      stackBars: true,
      axisY: {
        labelInterpolationFnc: function (value) {
          return (value / 1000) + 'k';
        }
      }
    }).on('draw', function (data) {
      if (data.type === 'bar') {
        data.element.attr({
          style: 'stroke-width: 30px'
        });
      }
    });
  }

  if ($("#chartist-simple-pie-chart").length) {
    var data = {
      series: [5, 3, 4]
    };

    var sum = function (a, b) {
      return a + b
    };

    new Chartist.Pie('#chartist-simple-pie-chart', data, {
      labelInterpolationFnc: function (value) {
        return Math.round(value / data.series.reduce(sum) * 100) + '%';
      }
    });
  }

  if ($("#chartist-pie-chart-custom-label").length) {
    var data = {
      labels: ['Bananas', 'Apples', 'Grapes'],
      series: [20, 15, 40]
    };

    var options = {
      labelInterpolationFnc: function (value) {
        return value[0]
      }
    };

    var responsiveOptions = [
      ['screen and (min-width: 640px)', {
        chartPadding: 30,
        labelOffset: 100,
        labelDirection: 'explode',
        labelInterpolationFnc: function (value) {
          return value;
        }
      }],
      ['screen and (min-width: 1024px)', {
        labelOffset: 80,
        chartPadding: 20
      }]
    ];

    new Chartist.Pie('#chartist-pie-chart-custom-label', data, options, responsiveOptions);
  }

  if ($("#chartist-gauge-chart").length) {
    new Chartist.Pie('#chartist-gauge-chart', {
      series: [20, 10, 30, 40]
    }, {
      donut: true,
      donutWidth: 60,
      startAngle: 270,
      total: 200,
      showLabel: false
    });
  }

  if ($("#chartist-donut-chart").length) {
    new Chartist.Pie('#chartist-donut-chart', {
      series: [20, 10, 30, 40]
    }, {
      donut: true,
      donutWidth: 60,
      donutSolid: true,
      startAngle: 270,
      showLabel: true
    });
  }
});