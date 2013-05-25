jQuery(document).ready(function() {
// watch position functions



        var objectasTable = function (obj,DOMid){
            
            
            
            var tableHTML="<table data-role='table' id='"+DOMid+"' data-mode='reflow' class='ui-responsive table-stroke ui-table'>\
            <thead><tr><td>Property</td><td>Value</td></tr></thead>";
            tableHTML+=""
            for (var p in obj){
                tableHTML+="<tr><td>"+p+"</td><td>"+obj[p]+"</td></tr>"        
            };
            tableHTML+="</table>"
            
            return tableHTML
        }



        var goodPositionChange = function(pos) {
          var crd = pos.coords;

          currentLatlng = new google.maps.LatLng(crd.latitude, crd.longitude);

          //update details table
          
          $("#currentPos").html(objectasTable(crd,"watchpositionTable"));
          
          timerow="<tr><td>timestamp</td><td><abbr class='timeago' title='"+(new Date(pos.timestamp)).toISOString()+"'>"+Date(pos.timestamp)+"</abbr></td></tr>"
           
          $('#watchpositionTable thead').append(timerow)
          
      
          $("#detailsPage").trigger( "updatelayout" )
          $("abbr.timeago").timeago();
          

          //update map

          user_marker.setPosition(currentLatlng);
          user_accuracy_circle.radius=crd.accuracy;

          var ne=geo.computeOffset(currentLatlng, crd.accuracy*1.5, 45),
              sw=geo.computeOffset(currentLatlng, crd.accuracy*1.5, 225);
          
          var currentView= new google.maps.LatLngBounds(sw,ne);           
          
          ttown.panToBounds(currentView);

          ttown.setCenter(currentLatlng);
          
        },

        badPositionChange = function (err) {
          console.warn('ERROR(' + err.code + '): ' + err.message);
        },
        options = {
          enableHighAccuracy: true,
        };

// couchdb functions
    var design = "tour",
        db = $.couch.db("tour"),
        changesRunning = false;

    var contentUpdate = function (){
        if (current_click_script){
            route_view(current_click_script);                     
        } 
     };

    var setupChanges = function (since) {
        if (!changesRunning) {
            var changeHandler = db.changes(since);
            changesRunning = true;
            changeHandler.onChange(contentUpdate);
        }
    };
    var view_router = {};

    var route_view = function (hash){
        var dfd = new $.Deferred();
        var this_hash=view_router[hash],
        ajax_data=this_hash.ajax_data ||{ descending : true};
        if (this_hash){
            $.ajax({
              url: "_list/"+this_hash.list+"/"+this_hash.view,
              data:ajax_data
              })
            .done( function(data) {
                  setupChanges(data.update_seq);
                  current_click_script=hash;
                  
                  if (this_hash.load_function){
                      this_hash.load_function(this_hash,data);
                  } else{
                      $(this_hash.destination).html(data);
                  }
                  dfd.resolve();
              }
            );
        }
        return dfd.promise();
    };
 
    var id, target, option;

// map functions

    var currentLatlng  = currentLatlng || new google.maps.LatLng(36.1539,-95.9925),
        ttown= ttown || new tulsa_map(document.getElementById("map_content")),
        geo=google.maps.geometry.spherical;
        
    viewport="M 1197,512 h -109 q -26,0 -45,19 -19,19 -19,45 v 128 q 0,26 19,45 19,19 45,19 h 109 Q 1165,876 1084.5,956.5 1004,1037 896,1069 V 960 q 0,-26 -19,-45 -19,-19 -45,-19 H 704 q -26,0 -45,19 -19,19 -19,45 v 109 Q 532,1037 451.5,956.5 371,876 339,768 h 109 q 26,0 45,-19 19,-19 19,-45 V 576 q 0,-26 -19,-45 -19,-19 -45,-19 H 339 Q 371,404 451.5,323.5 532,243 640,211 v 109 q 0,26 19,45 19,19 45,19 h 128 q 26,0 45,-19 19,-19 19,-45 V 211 q 108,32 188.5,112.5 Q 1165,404 1197,512 z m 339,192 V 576 q 0,-26 -19,-45 -19,-19 -45,-19 H 1329 Q 1292,351 1174.5,233.5 1057,116 896,79 V -64 q 0,-26 -19,-45 -19,-19 -45,-19 H 704 q -26,0 -45,19 -19,19 -19,45 V 79 Q 479,116 361.5,233.5 244,351 207,512 H 64 Q 38,512 19,531 0,550 0,576 v 128 q 0,26 19,45 19,19 45,19 H 207 Q 244,929 361.5,1046.5 479,1164 640,1201 v 143 q 0,26 19,45 19,19 45,19 h 128 q 26,0 45,-19 19,-19 19,-45 v -143 q 161,-37 278.5,-154.5 Q 1292,929 1329,768 h 143 q 26,0 45,-19 19,-19 19,-45 z";

    goldstar='M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z';

    //custom symbol
    var goldStar = {
      path: goldstar,
      fillColor: "green",
      fillOpacity: .1,
      scale: .5,
      strokeColor: "black",
      strokeWeight: 1
    };

    // icon:{
    //     anchor: (0,0),
    //     path:viewport,
    //     scale:.05,
    //     fillOpacity:1,
    //     fillColor:"blue",
    //     strokeColor:"black",
    //     strokeOpacity:.3
    // }


    var user_marker = user_marker || new google.maps.Marker({
        map: ttown,
        visible:false,
    });

// user circle
     var user_circle = new google.maps.Circle({
       map: ttown,
       radius: 2,  
       fillColor: 'greenyellow',
       fillOpacity: 1,
       strokeColor:"black",
       strokeOpacity:1
     });
     user_circle.bindTo('center', user_marker, 'position');
    
    // Add circle overlay and bind to marker
     var user_accuracy_circle = new google.maps.Circle({
       map: ttown,
       radius: 10,  
       fillColor: 'greenyellow',
       fillOpacity: 0.3,
       strokeOpacity:0
     });
     user_accuracy_circle.bindTo('center', user_marker, 'position');

    var placeLocationTitle = function (map,title,loc_postion){

        var marker1 = new MarkerWithLabel({
          position: loc_postion,
          map: map,
          labelContent: title,
          labelAnchor: new google.maps.Point(22, 0),
          labelClass: "loc_labels", // the CSS class for the label
          labelStyle: {opacity: 1},
          visible: true,
          icon:{}
        });
    };
    
    var placeLocationCircle = function (map,marker){
        var location_circle = new google.maps.Circle({
          map: map,
          radius: 2,  
          fillColor: 'silver',
          fillOpacity: 1,
          
          strokeOpacity:.1
        });
        location_circle.bindTo('center', marker, 'position');
    };



    var load_markers = function (map){
        var dfd = new $.Deferred();
        $.ajax({
          url: "_list/gm_markers/locations"
          })
        .done( function(data) { 
              locations = JSON.parse(data);
              for (var mrk in locations){
                  if (locations[mrk].lat){
                      var loc_postion= new google.maps.LatLng(locations[mrk].lat,locations[mrk].lng)
                      var new_marker = new google.maps.Marker({
                          map: map,
                          position: loc_postion,
                          title:locations[mrk].name,
                          visible:false
                      });
                      placeLocationTitle(map,locations[mrk].name,loc_postion);
                      placeLocationCircle(map,new_marker);
                  }
              };              
              dfd.resolve();
         });
        return dfd.promise();
    };


// page behavior functions

    var locationsLoaded = function (this_hash,data){
        $(this_hash.destination).html(data);
        $('i.row-delete').unbind('click');
        $('i.row-delete').click(function (event) {
            event.preventDefault();
            var thisDOC = $(this).closest('tr');
            db.removeDoc({   _id: thisDOC.attr('id'),
                            _rev: thisDOC.data('rev')})
            }
        );
        load_markers(ttown);
    };
    
    view_router.locations={
            "title": "Saved Locations",
            "list": "jqm_table",
            "view": "locations",
            "destination": "#locationTable",
            "load_function":locationsLoaded,
            "ajax_data":{ descending : false ,reduce:false}
        };


    // make new position form a  couchform
    $('#newLocation').couchForm({
        beforeSave : function(doc) {
            doc.lat=currentLatlng.lat();
            doc.lng=currentLatlng.lng();
            doc.created_at = new Date();
            return doc;
        }
    });

    $('#saveLocation').click(function (event) { 
        event.preventDefault();
        $('#newLocation').submit();
        $.mobile.changePage("#locationPage");
    });

    $("#locationPage").on("pageshow",function(){
        route_view('locations');  
    });


    $("#watchPositionPage").on("pageshow",function(){
        $("#detailsPage").trigger( "updatelayout" )
         
    });

//device orientation page
    var devicetimestamp;
    
    var devicepagemovement = function (e) {
        devicetimestamp= devicetimestamp ||e.timeStamp;
        if (e.timeStamp-devicetimestamp>500){
            $("#deviceorientationEvent").html(objectasTable(e));
            devicetimestamp=e.timeStamp;
        }
      };
    
    $("#deviceorientationPage").on("pageinit",function(){
        if (window.DeviceOrientationEvent) {
          window.addEventListener("deviceorientation", devicepagemovement,false);
      }
    });
    $("#deviceorientationPage").on("pagebeforehide",function(){
          window.removeEventListener('deviceorientation', devicepagemovement, false);
    });
    
    
    
//wayfinding

var currentGoal  = currentGoal || new google.maps.LatLng(36.159598343107994,-95.99202250139416);
 


  var rotate = function (deg) {  
      $(".pointer").css({ "-moz-transform": "rotate(0deg)"});
      $(".pointer").css({ "-moz-transform": "rotate(" + deg + "deg)"});
    
      $(".pointer").css({ "-o-transform": "rotate(0deg)"});
      $(".pointer").css({ "-o-transform": "rotate(" + deg + "deg)"});
    
      $(".pointer").css({ "-ms-transform": "rotate(0deg)"});
      $(".pointer").css({ "-ms-transform": "rotate(" + deg + "deg)"});
    
      $(".pointer").css({ "-webkit-transform": "rotate(0deg)"});
      $(".pointer").css({ "-webkit-transform": "rotate(" + deg + "deg)"});
    
      $(".pointer").css({ "transform": "rotate(0deg)"});
      $(".pointer").css({ "transform": "rotate(" + deg + "deg)"});
  };
 
  var lasttimestamp;
  
  var directionpagemovement = function (e) {
      lasttimestamp= lasttimestamp ||e.timeStamp;
      if (e.timeStamp-lasttimestamp>100){
          newheading= geo.computeHeading(currentLatlng,currentGoal);
          rotate(newheading-(360-e.alpha));
          goalDistance= geo.computeDistanceBetween(currentLatlng,currentGoal);
          dirHTML ="<div>e.alpha: "+e.alpha+"</div></br>"
          dirHTML+="<div>e.beta: "+e.beta+"</div></br>"
          dirHTML+="<div>e.gamma: "+e.gamma+"</div></br>"

          dirHTML+="<div>heading: "+newheading+"</div></br>"
          dirHTML+="<div>Distance: "+goalDistance+"</div></br>"
          $("#eAlpha").html(dirHTML);
          lasttimestamp=e.timeStamp;
      }
    };
 
    $("#mapPage").on("pageshow",function(){
        route_view('locations');  
        google.maps.event.trigger(ttown, 'resize');
        ttown.setCenter(currentLatlng);
        window.addEventListener("deviceorientation", directionpagemovement,false);
 
    });   
 
  
  $("#directionsPage").on("pageinit",function(){
      
      if (window.DeviceOrientationEvent) {
         
        window.addEventListener("deviceorientation", directionpagemovement,false);
    }
    
    
  });
  $("#directionsPage").on("pagebeforehide",function(){
        window.removeEventListener('deviceorientation', directionpagemovement, false);
  });
  
// start watching position
var positionWatchID = positionWatchID || navigator.geolocation.watchPosition(goodPositionChange, badPositionChange, options);
    
});

