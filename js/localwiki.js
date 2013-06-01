"use strict";

var WikiAPI = (function () {

    function API(options){
        var call_map = {
            'site': '/api/site',
            'search': '/page/search',
            'pages': '/api/page',
            'users': '/api/user',
            'redirect': '/api/redirect'
        }

        this.options = _.defaults(options, {
            url: 'http://www.tulsawiki.com'
        })

        // setup simple api mappings
        _.each(call_map, function(uri, name){
            API.prototype[name] = function(params){
                return this.call_api(uri, params)
            }
        });
    }

    API.prototype.set_url = function (url){
        if (url){
            this.options.url=url;
        }
        return this;
    };

    API.prototype.call_api = function (resource, ajax_params){
        if (!resource && !_.isString(resource)) {
            throw new Error('must call WikiAPI.call_api with a proper resource');
        }
        ajax_params = ajax_params || {};
        return $.ajax({
            type: "get",
            url: this.options.url+resource,
            data: ajax_params,
            dataType: 'json',
        })
    };

    API.prototype.current_page = function (resource_uri){
        if (resource_uri){
            this.options.current_page=resource_uri;
        }
        return this.options.current_page;
    };

    //returns a single page
    API.prototype.page = function (resource_uri){
        var dfd = new $.Deferred(),
            api = this;
        api.call_api(resource_uri)
            .done( function(data) {
                //fully qualify src with url
                if (data.content && data.content.indexOf("src=")){
                    var src = data.content.split('src="');
                    data.content = src.join('src="http://' + api.options.url + '/' + data.name + '/');
                }
                dfd.resolve(data);
            })
            .fail( function(data) {
                  dfd.reject(data);
            })
        return dfd.promise();
    };

    // get me some tags
    API.prototype.tags =  function (tagname){
        if (tagname){
            return this.call_api("/api/page_tags", {"tags__slug__in":tagname});
        } else {
            return this.call_api("/api/tag");
        }
    };

    API.prototype.map = function(resource) {
        var dfd = new $.Deferred();
        if (resource){
            this.call_api(resource)
                .done( function(data) {
                    dfd.resolve(data);
                })
                .fail( function(data) {
                    dfd.reject(data);
                });
        }
        return dfd.promise();
    };

    API.prototype.next = function (resource, caller, callback){
        var dfd = new $.Deferred();
        if (resource){
            this.call_api(resource)
                .done( function(data) {
                    dfd.resolve(caller, data);
                })
                .fail( function(data) {
                    dfd.reject();
                });
        }
        return dfd.promise();
    };

    return API

}());

