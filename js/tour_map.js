var tour_map = function (element) {
    var map_element = null,
    user_accuracy_circle,
    user_circle,
    user_marker,
    tulsaLatlng =  tulsaLatlng ||  new google.maps.LatLng(36.1539,-95.9925),

    tulsa_styles=[
      {
        "featureType": "landscape",
        "stylers": [
          { "invert_lightness": true }
        ]
      },{
        "featureType": "road",
        "stylers": [
          { "invert_lightness": true },
          { "lightness": 48 },
          { "gamma": 0.8 },
          { "color": "#808080" }
        ]
      },{
        "featureType": "poi.park",
        "elementType": "geometry"  },{
      }
    ],

    tulsaMapOptions = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center:tulsaLatlng,
        panControl: false,
        scaleControl: false,
        overviewMapControl: false,

        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER,
        },

        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM,
        },

        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_CENTER,
        },
    },

    map_marker = function(map){
        var this_marker;
        if(map){
            this_marker= new google.maps.Marker({
                map: map,
                visible:false,
            });
        }
        return this_marker;
    },
    map_circle = function(map,options){
         var this_circle;
         if(map&&options){
             options.map=map;
             this_circle=new google.maps.Circle(options);
             this_circle.bindTo('center', user_marker, 'position');
         }
       return this_circle;  
     },
    user_circle_options= {
        radius: 2,  
        fillColor: 'greenyellow',
        fillOpacity: 1,
        strokeColor:"black",
        strokeOpacity:1
    },
    accuracy_circle_options = {
       radius: 10,  
       fillColor: 'greenyellow',
       fillOpacity: 0.3,
       strokeOpacity:0
    },
    posChange = function(pos) {
        if (pos){
            newLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            user_marker.setPosition(newLatlng);
            user_accuracy_circle.radius=crd.accuracy;
            // this.map.setCenter(currentLatlng);
        }
    },
    posFail = function (err) {
        if (err){
            console.warn('ERROR(' + err.code + '): ' + err.message);
        }
    },
    addGeomteries = function (geoJSON) {
        var pointArray=[];    
        for (var geom in geoJSON){
            var gglV = new GeoJSON(geoJSON[geom], {});
            if (gglV.error){
                // Handle the error.
            }else{
                gglV.setMap(gglMap);
                if(gglV.position){
                    pointArray.push(gglV.position);                            
                }
                if(gglV.getPaths){
                    gglV.getPath().forEach(function(position,idx){
                        pointArray.push(new google.maps.LatLng(position.lat(),position.lng()));                            

                    });

                }
            }

        }
        gglMap.fitBounds(findBounds(pointArray));
    };
    

    if (element !== map_element){
        map_element = element;
        google.maps.visualRefresh=true;
        this.map = new google.maps.Map(map_element, tulsaMapOptions);   
        user_marker = new map_marker(this.map);
        user_accuracy_circle = new  map_circle(this.map,accuracy_circle_options);
        user_circle= new map_circle(this.map,user_circle_options);
        this.map.posChange = posChange;
        this.map.posFail = posFail;
    }

    return this.map;

};

