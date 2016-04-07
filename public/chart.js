var Chart = function (title, type, container, seriesName, data, xAxis, yAxis) {
  var chart = new Highcharts.Chart({
    chart: {
      renderTo: container,
      type: type
    },
    title: {
      text: title
    },
    series: [{
      name: seriesName,
      data: data,
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    }],
    //// I think the series object should be in chartData , eg this.series = function( seriesName, chartColor, chartData) that makes [{ name: seriesName, color: chartColor, data: chartData}],
    xAxis: xAxis,
    yAxis: yAxis
  });

}