var ChartData = function(){
  this.xAxisAngled = function(teamNames){
  var result = [{
      categories: teamNames,
      labels: {
        rotation: -45,
        style: {
            fontSize: '10px',
            fontFamily: 'Verdana, sans-serif'}
      }
    }]
    return result;
  };
  this.yAxis = {
    min: 0,
    title: {
      text: 'Capacity'
    }
  };
  // this.series = function( data ){
  //   var result = [{
  //     color: #ffca63,
  //     data: data
  //     }]
  //     return result;
  // };


  // this.series = function( seriesName, chartData, chartColor ){
  //   var result = [{
  //     name: seriesName,
  //     color: chartColor,
  //     data: chartData
  //   }]
  //   return result;
  // }
};