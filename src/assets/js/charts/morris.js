$(function () {
  'use strict';

  if ($("#morris-line-chart").length) {
    Morris.Line({
      element: 'morris-line-chart',
      data: [{
          y: '2006',
          a: 100,
          b: 90
        },
        {
          y: '2007',
          a: 75,
          b: 65
        },
        {
          y: '2008',
          a: 50,
          b: 40
        },
        {
          y: '2009',
          a: 75,
          b: 65
        },
        {
          y: '2010',
          a: 50,
          b: 40
        },
        {
          y: '2011',
          a: 75,
          b: 65
        },
        {
          y: '2012',
          a: 100,
          b: 90
        }
      ],
      xkey: 'y',
      ykeys: ['a', 'b'],
      lineColors: chartColors,
      labels: ['Series A', 'Series B']
    });
  }

  if ($("#morris-area-chart").length) {
    Morris.Area({
      element: 'morris-area-chart',
      data: [{
          y: '2006',
          a: 100,
          b: 90
        },
        {
          y: '2007',
          a: 75,
          b: 65
        },
        {
          y: '2008',
          a: 50,
          b: 40
        },
        {
          y: '2009',
          a: 75,
          b: 65
        },
        {
          y: '2010',
          a: 50,
          b: 40
        },
        {
          y: '2011',
          a: 75,
          b: 65
        },
        {
          y: '2012',
          a: 100,
          b: 90
        }
      ],
      xkey: 'y',
      ykeys: ['a', 'b'],
      lineColors: chartColors,
      labels: ['Series A', 'Series B']
    });
  }

  if ($("#morris-bar-chart").length) {
    Morris.Bar({
      element: 'morris-bar-chart',
      data: [{
          y: '2006',
          a: 100,
          b: 90
        },
        {
          y: '2007',
          a: 75,
          b: 65
        },
        {
          y: '2008',
          a: 50,
          b: 40
        },
        {
          y: '2009',
          a: 75,
          b: 65
        },
        {
          y: '2010',
          a: 50,
          b: 40
        },
        {
          y: '2011',
          a: 75,
          b: 65
        },
        {
          y: '2012',
          a: 100,
          b: 90
        }
      ],
      xkey: 'y',
      ykeys: ['a', 'b'],
      barColors: chartColors,
      labels: ['Series A', 'Series B']
    });
  }

  if ($("#morris-donut-chart").length) {
    Morris.Donut({
      element: 'morris-donut-chart',
      data: [{
          label: "Download Sales",
          value: 12
        },
        {
          label: "In-Store Sales",
          value: 30
        },
        {
          label: "Mail-Order Sales",
          value: 20
        }
      ],
      colors: chartColors
    });
  }
});