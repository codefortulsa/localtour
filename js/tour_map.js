
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

    if (element !== map_element){
        map_element = element;
        google.maps.visualRefresh=true;
        this.map = new google.maps.Map(element, tulsaMapOptions);        
    }

    return this.map;
};
