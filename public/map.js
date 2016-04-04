var Map = function( latLng, zoom){

  this.googleMap = new google.maps.Map( document.getElementById("map"), {
    center: latLng,
    zoom: zoom
  } );


  this.addMarker = function( latLng, title ){
    var marker = new google.maps.Marker( {
      position: latLng,
      map: this.googleMap,
      title: title
    });
    return marker;
  };


  this.addMarkerAndInfo = function( latLng, title ){
    var marker = this.addMarker( latLng, title );
    var info = new google.maps.InfoWindow({
      content: title
    });
    // marker.addEventListener("mouseover", function(event){
    //   marker.setAnimation(google.maps.Animation.BOUNCE)
    // });
    //// I WAS TRYING TO MAKE MARKER BOUNCE WHEN MOUSE GOES OVER IT.
    info.open( this.googleMap, marker );
  };



}