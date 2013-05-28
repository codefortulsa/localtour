localtour
=========

HTML5 Mobile web-app for displaying information from a Localwiki deployment as an tour.


Explaining the files:

index.html  -- A one page jquerymobile application.

app.js --  is responsible for running the jquery mobile application.  It has three sections:

1. Functions for rendering localwiki objects as HTML
2. Shared behavior functions like click on a link to a wiki object
3. jquerymobile events for loading each page 

localwiki.js  -- a simple javascript library to handle the localwiki API.  Eventually this should become it's own project.

tour_map.js  -- javascript object for google maps

geohelper.js  -- intended for any extra help translating or dealing with geoJSON and Google Maps

GeoJSON.js -- Helpful library for converting geoJSON object from localwiki into Google Maps  (https://github.com/JasonSanford/GeoJSON-to-Google-Maps)



