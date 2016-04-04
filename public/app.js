window.onload = function () {
    var data = "stadiums.json"
    var request = new XMLHttpRequest();
    request.open("GET", data);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var stadiums = JSON.parse(jsonString);
            main(stadiums);


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
    orderByCapacity( stadiums );
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
        var index = this.options[this.selectedIndex].value;
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


//// BUG: The sort below overwrites the stadiums data, so that the first team in the drop down (Aberdeen) displays the info of Wembley because it has the largest capacity. How do I make this method to sort by capacity but not affect the data elsewhere?

 // var orderByCapacity = function( stadiums ){
 //    var ordered = stadiums.sort( function( a, b ){
 //        if( a.capacity > b.capacity)
 //            return -1;
 //        else if( a.capacity < b.capacity)
 //            return 1;
 //        else
 //            return 0;
 //    })
 //    return ordered;
 // }; ///////   COULD SEND THIS TO A GRAPH, PICK FIRST eg.10 INDEXs TO GRAPH LARGEST STADIUMS
