window.onload = function () {
    var data = "stadiums.json"
    var request = new XMLHttpRequest();
    request.open("GET", data);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var stadiums = JSON.parse(jsonString);
            main(stadiums);


            ///// these should prob be getting called in the 'main' function:
            populateChart1(stadiums, 20, "Capacity" , false, "team")
            populateChart2(stadiums, 20, "Capacity" , true, "team")




            //////  SHOULD ADD: sort by team name so that teams are displayed alphabetically in dropdown. pretty much the same as sortByCapacity.
            //// I hard coded the data alphabetically in my json file.


        }
    }
    request.send(null);
};



var main = function( stadiums ){
    populateDropdown( stadiums );
    var cached = localStorage.getItem("selectedTeam");
    var selected = stadiums[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector("#dropdown").selectedIndex = selected.index;
    };
    updateDisplay( selected );
    updateMap( selected );
};


var populateDropdown = function( stadiums ){
    
    var dropdown = document.getElementById("dropdown");

    var defaultOption = document.createElement("option");
    defaultOption.text = " - select team - ";
    dropdown.appendChild(defaultOption)

    stadiums.forEach( function (item, index){
        var option = document.createElement("option");
        option.value = index;
        option.text = item.team;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', function(event){
        // console.log('this', this.options);
        // console.log('target', event.target);
        // var index = event.target
        var selectedOption = this.options[this.selectedIndex];
        var index = selectedOption.value;
        // console.log(this.options)  what is this.options ?? eg, where does it come from?? It makes my code work but I copied it from the country lab we did in class but I dont really understand it.
        var selectedTeam = stadiums[ index ];
        updateDisplay( selectedTeam );
        updateMap( selectedTeam );
        localStorage.setItem("selectedTeam", JSON.stringify( selectedTeam ) );
    })
};


var updateDisplay = function( selectedTeam ){
    var display = document.querySelectorAll("#teaminfo p");
    display[0].innerText = "Team: " + selectedTeam.team;
    display[1].innerText = "Home Stadium: " + selectedTeam.name;
    display[2].innerText = "Stadium Capacity: " + selectedTeam.capacity;
    updateMap( selectedTeam );
};


var updateMap = function( selectedTeam ){
    var lat = selectedTeam.lat;
    var lng = selectedTeam.lng;
    var map = new Map( { lat: lat, lng: lng}, 10)
    map.addMarkerAndInfo( { lat: lat, lng: lng}, selectedTeam.name)
};

// var chartStadius = function(){
// };


// BUG: The sort below overwrites the stadiums data, so that the first team in the drop down (Aberdeen) displays the info of Wembley because it has the largest capacity. How do I make this method to sort by capacity but not affect the data elsewhere?
//// BUG FIXED: by using .slice() it clones the array so that 'var ordered' is a new array that has been sorted and the array 'stadiums' still remains as it was before we sorted by capacty. Without the .slice() the original array 'stadiums' is changed by the sort().

var orderByCapacity = function( stadiums ){
    var unordered = stadiums.slice();
    var ordered = unordered.sort( function( a, b ){
        return b.capacity - a.capacity;
    })
    // console.log( "ordered by capacity", ordered)
    return ordered;
 };

var selectFromCapacity = function( stadiums, number, reverse){
    var data = orderByCapacity(stadiums);
    var selectedTeams = null;
    if(reverse){
        selectedTeams = data.reverse().slice( 0, number);
    }else{
        selectedTeams = data.slice( 0, number);
    }
   
    // console.log( "largest stadiums", selectedTeams );
    return selectedTeams;
};

var arrayOf= function( stadiums, number, reverse, type ){
    var selection = selectFromCapacity( stadiums, number, reverse);
    var capacities = selection.map(function(a){ return a[type]});
    console.log("largest capacities: ", capacities);
    return capacities;
};

var createChartData = function(stadiums, number, reverse){
    var array1 = arrayOf( stadiums, number, reverse, "name")
    var array2 = arrayOf(stadiums, number, reverse, "capacity");
    var result = [];
    for( i=0; i< array1.length; i++){
        result.push( [array1[i], array2[i]] )
    };
    console.log("data ready for graph - largest", result)
    console.log("data ready for graph - largest", result[0])
    return result;
};
//// COMPLETED ABOVE - for series entry in chart need-  data: [ ['team name', capacity], ['team name', capacity], ['team name', capacity]  ]
//// The name part is on the hover display, not xAxis.


var populateChart1 = function( stadiums, number, seriesName, reverse, category){
    var data = new ChartData();
    var containers = new ChartContainers();
    var type = new ChartTypes();
    var title = "The " + number + " Largest Capacity Stadiums in the UK";
    var chartData = createChartData( stadiums, number, reverse);
    var categories = arrayOf(stadiums, number, reverse, category);
    new Chart( title, type.column, containers.highestCapacity, seriesName, chartData, data.xAxisAngled( categories ), data.yAxis);
};
////// need to refactor above so that can add in title, type of graph, type of container, xAxis, yAxis. Then it will be fully customisable - could reuse in different ways by calling populate chart, wouldnt need to have populateChart1, populateChart2, etc.   Will be alot of stuff being passed to populateChart so could pass an object eg, populateChart( options ) then do options.thing or options[thing]

var populateChart2 = function( stadiums, number, seriesName, reverse, category){
    var data = new ChartData();
    var containers = new ChartContainers();
    var type = new ChartTypes();
    var title = "The " + number + " Smallest Capacity Stadiums in the UK";
    var chartData = createChartData( stadiums, number, reverse);
    var categories = arrayOf(stadiums, number, reverse, category);
    new Chart( title, type.column, containers.lowestCapacity, seriesName, chartData, data.xAxisAngled( categories ), data.yAxis);
};



//// POSSIBLE ADDITION: could make an input so user could select how many teams to show on chart.

