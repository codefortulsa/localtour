var templates={
    pages:"{{#objects}}<li><a data-resource_uri='{{resource_uri}}'>{{name}}</a></li>{{/objects}}",
    tours:"{{#objects}}<li data-center-lat='{{lat}}' data-center-lng='{{lng}}'} >\
     <a data-resource_uri='{{page.resource_uri}}'>{{page.name}}<div class='distance'></div></a></li>{{/objects}}",
    tourPoint:"{{#points}}<li><a class='tour_point' data-resource_uri='{{resource_uri}}'>{{name}}</a></li>{{/points}}"
}
