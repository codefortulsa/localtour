"use strict";
var findBounds = function (arrayLatlng){        
    // Based on Google Maps API v3 
    // Purpose: given an array of Latlng's return a LatlngBounds
    // Why: This is helpful when using fitBounds, panTo
    var newBounds = new google.maps.LatLngBounds,p=0;

    do {
        newBounds.extend(arrayLatlng[p])
        p+=1;
    } while (p < arrayLatlng.length);

    return newBounds;
};

var addGeomteries = function (geoJSON, gglMap) {
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

var gglGeometries = function () {
    var pointArray=[],vectorArray=[];    
    
    this.addGeos = function (geoJSON) {
        if (geoJSON){
            for (var geom in geoJSON){
                var gglV = GeoJSON(geoJSON[geom], {});
                if (gglV.error){
                    // Handle the error.
                }else{
                    vectorArray.push(gglV)                            
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
        }
    };

    this.center = function (){
        var maxLat=-90,minLat=90,maxLng=-180,minLng=180,center={};
        
        _.each(pointArray,function(pnt){
            if (pnt.lat()>maxLat){maxLat=pnt.lat()}
            if (pnt.lat()<minLat){minLat=pnt.lat()}
            if (pnt.lng()<minLng){minLng=pnt.lng()}
            if (pnt.lng()>maxLng){maxLng=pnt.lng()}
        });
        center.lat = minLat + ((maxLat - minLat) / 2);
        center.lng = minLng + ((maxLng - minLng) / 2);
        return new google.maps.LatLng(center.lat,center.lng);
    };

    
    this.bounds = function (){
        return findBounds(pointArray);
    };
    
    
    this.setMap = function (map){
        var this_map=map; // put map in the closure
        vectorArray.forEach(function(v){
            v.setMap(map);
        });
    };

    return this;
    
};
