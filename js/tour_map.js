
var tulsa_styles=[
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
];


// tfdd map 
var tulsa_map= function (element) {    
    // 'tulsa 36.1539,-95.9925'
        
        var map_element = null,
        tulsaLatlng =  tulsaLatlng ||  new google.maps.LatLng(36.1539,-95.9925),
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
        };

        var map_marker = function(map){
            var this_marker;
            if(map){
                this_marker= new google.maps.Marker({
                    map: map,
                    visible:false,
                });
            }
            return this_marker;
        };
            

        // user circle
             var map_circle = function(map){
                 var this_circle;
                 
                 if(map){
                     this_circle=new google.maps.Circle({
                       map: map,
                       radius: 2,  
                       fillColor: 'greenyellow',
                       fillOpacity: 1,
                       strokeColor:"black",
                       strokeOpacity:1
                     });
                     this_circle.bindTo('center', user_marker, 'position');
                 }
               return this_circle;  
             };

            // Add circle overlay and bind to marker
             var accuracy_circle = function(map){
                 var this_circle;
                 if (map){
                     this_circle = new google.maps.Circle({
                       map: map,
                       radius: 10,  
                       fillColor: 'greenyellow',
                       fillOpacity: 0.3,
                       strokeOpacity:0
                     });
                     this_circle.bindTo('center', user_marker, 'position');
                 }
                 return this_circle;
             };

        var posChange = function(pos) {
            if (pos){
                newLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                user_marker.setPosition(newLatlng);
                user_accuracy_circle.radius=crd.accuracy;
                // this.map.setCenter(currentLatlng);
                
            }
        };

        var posFail = function (err) {
            if (err){
                console.warn('ERROR(' + err.code + '): ' + err.message);
            }
        };

    var user_accuracy_circle;
    var user_circle;
    var user_marker;


    if (element !== map_element){
        map_element = element;
        google.maps.visualRefresh=true;
        this.map = new google.maps.Map(element, tulsaMapOptions);   
        user_marker = new map_marker(this.map);
        user_accuracy_circle = new  accuracy_circle(this.map);
        user_circle= new map_circle(this.map);
        this.map.posChange = posChange;
        this.map.posFail = posFail;
             
    }

    return this.map;
};
