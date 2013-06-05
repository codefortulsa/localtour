var templates={
    pages:"{{#objects}}<li><a data-resource_uri='{{resource_uri}}'>{{name}}</a></li>{{/objects}}",
    tours:"{{#objects}}<li data-center='{lat:{{lat}},lng:{{lng}}}' > <a data-resource_uri='{{page.resource_uri}}'>{{page.name}}</a></li>{{/objects}}",
    tourPoint:"{{#points}}<li><a class='tour_point' data-resource_uri='{{resource_uri}}'>{{name}}</a></li>{{/points}}"
}
