window.onload = function () {
    var data = "stadiums.json"
    var request = new XMLHttpRequest();
    request.open("GET", data);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var stadiums = JSON.parse(jsonString);
            main(stadiums);
            populateChartLargestCapacities(stadiums, 20, "Capacity");
            populateChartSmallestCapacities(stadiums, 20, "Capacity");

            //// only here for testing - need  to make actual TDD for this.
            // selectFromHighestCapacity( stadiums, 20 );
            // selectFromLowestCapacity( stadiums, 20 );
            // arrayOfLargestCapacities( stadiums, 20);
            // arrayOfSmallestCapacities( stadiums, 20);
            // arrayOfTeamsByLargestCapacities( stadiums, 20);
            // arrayOfTeamsBySmallestCapacities( stadiums, 20);
            // createChartDataLargest(stadiums, 20);




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

var selectFromHighestCapacity = function( stadiums, number){
    var data = orderByCapacity(stadiums);
    var selectedTeams = data.slice( 0, number);
    // console.log( "largest stadiums", selectedTeams );
    return selectedTeams;
};

var selectFromLowestCapacity = function( stadiums, number){
    var data = orderByCapacity(stadiums);
    var selectedTeams = data.reverse().slice( 0, number);
    // console.log( "lowest stadiums", selectedTeams );
    return selectedTeams;
};

var arrayOfLargestCapacities= function( stadiums, number ){
    var selection = selectFromHighestCapacity( stadiums, number);
    var capacities = selection.map(function(a){ return a.capacity});
    console.log("largest capacities: ", capacities);
    return capacities;
}

var arrayOfSmallestCapacities = function(stadiums, number){
    var selection = selectFromLowestCapacity(stadiums, number);
    var capacities = selection.map(function(a){ return a.capacity});
    console.log("smallest capacities: ", capacities);
    return capacities;
}

var arrayOfTeamsByLargestCapacities= function( stadiums, number ){
    var selection = selectFromHighestCapacity( stadiums, number);
    var capacities = selection.map(function(a){ return a.team});
    console.log("largest capacity teams: ", capacities);
    return capacities;
}

var arrayOfTeamsBySmallestCapacities = function(stadiums, number){
    var selection = selectFromLowestCapacity(stadiums, number);
    var capacities = selection.map(function(a){ return a.team});
    console.log("smallest capacity teams: ", capacities);
    return capacities;
}

var arrayOfStadiumNamesByLargestCapacities= function( stadiums, number ){
    var selection = selectFromHighestCapacity( stadiums, number);
    var capacities = selection.map(function(a){ return a.name});
    console.log("largest capacity teams: ", capacities);
    return capacities;
}

var arrayOfStadiumNamesBySmallestCapacities = function(stadiums, number){
    var selection = selectFromLowestCapacity(stadiums, number);
    var capacities = selection.map(function(a){ return a.name});
    console.log("smallest capacity teams: ", capacities);
    return capacities;
}

var createChartDataLargest = function(stadiums, number){
    var array1 = arrayOfStadiumNamesByLargestCapacities(stadiums, number);
    var array2 = arrayOfLargestCapacities(stadiums, number);
    var result = [];
    for( i=0; i< array1.length; i++){
        result.push( [array1[i], array2[i]] )
    };
    console.log("data ready for graph - largest", result)
    console.log("data ready for graph - largest", result[0])
    return result;
}
//// COMPLETED ABOVE - for series entry in chart need-  data: [ ['team name', capacity], ['team name', capacity], ['team name', capacity]  ]
//// The name part is on the hover display, not xAxis.

var createChartDataSmallest = function(stadiums, number){
    var array1 = arrayOfStadiumNamesBySmallestCapacities(stadiums, number);
    var array2 = arrayOfSmallestCapacities(stadiums, number);
    var result = [];
    for( i=0; i< array1.length; i++){
        result.push( [array1[i], array2[i]] )
    };
    // console.log("data ready for graph - Smallest", result)
    // console.log("data ready for graph - Smallest", result[0])
    return result;
}


var populateChartLargestCapacities = function( stadiums, number, seriesName){
    var data = new ChartData();
    var containers = new ChartContainers();
    var type = new ChartTypes();
    var title = "The " + number + " Largest Capacity Stadiums in the UK";
    var largestData = createChartDataLargest( stadiums, number);
    var nameOfSeries = seriesName;
    var categories = arrayOfTeamsByLargestCapacities(stadiums, number);
    new Chart( title, type.column, containers.highestCapacity, nameOfSeries, largestData, data.xAxisAngled( categories ), data.yAxis)
}
//// POSSIBLE ADDITION: could make an input so user could select how many teams to show on chart.

var populateChartSmallestCapacities = function( stadiums, number, seriesName){
    var data = new ChartData();
    var containers = new ChartContainers();
    var type = new ChartTypes();
    var title = "The " + number + " Smallest Capacity Stadiums in the UK";
    var smallestData = createChartDataSmallest( stadiums, number);
    var nameOfSeries = seriesName;
    var categories = arrayOfTeamsBySmallestCapacities(stadiums, number);
    new Chart( title, type.column, containers.lowestCapacity, nameOfSeries, smallestData, data.xAxisAngled( categories ), data.yAxis)
}
