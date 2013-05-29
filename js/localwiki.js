"use strict";
var localwiki = (function () {
    var wiki = {},
        options={};
        
    // set default url
    options.url=options.url || 'http://www.tulsawiki.com';
    
    wiki.url = function (url){
        if (url){
            options.url=url;                
        }
        return options.url;        
    };

    var wikiapi = function (resource,ajax_params){
        var dfd = new $.Deferred(),
        ajax_params=ajax_params ||{};
        if (resource){
            $.ajax({
              type:"GET",
              url: options.url+resource,
              data:ajax_params,
              dataType:'json',
              })
            .done( function(data) {
                  
                  dfd.resolve(data);
              }
            )
            .fail(function(data){
                dfd.reject(data)
            });
        }
        return dfd.promise();
    };
    
    wiki.current_page = function (resource_uri){
        if (resource_uri){
            options.current_page=resource_uri;                
        }
        return options.current_page;        
    };

    wiki.site = function (params){
        var dfd = new $.Deferred();

        wikiapi("/api/site")
            .done( function(data) {
                dfd.resolve(data);
            })
            .fail( function(data) {
                  dfd.reject(data);
            })
        return dfd.promise();

    };

    
    wiki.search = function (params){
        var dfd = new $.Deferred();

        wikiapi("/api/page/search",params)
            .done( function(data) {
                dfd.resolve(data);
            })
            .fail( function(data) {
                  dfd.reject(data);
            })
        return dfd.promise();
    };

    wiki.uri = function (resource_uri,params){
        var dfd = new $.Deferred();

        wikiapi(resource_uri,params)
            .done( function(data) {
                dfd.resolve(data);
            })
            .fail( function(data) {
                  dfd.reject(data);
            })
        return dfd.promise();
    };

    wiki.pages = function (params){
        
        var dfd = new $.Deferred(),
        params = params || {};

        wikiapi("/api/page",params)
            .done( function(data) {
                dfd.resolve(data);
            })
            .fail( function(data) {
                  dfd.reject(data);
            })
        return dfd.promise();
    };
    
    wiki.page = function(resource_uri) {
        var dfd = new $.Deferred();

        wikiapi(resource_uri)
            .done( function(data) {
                //fully qualify src with url
                if (data.content && data.content.indexOf("src=")){
                    var src = data.content.split('src="');
                    data.content = src.join('src="http://' + options.url + '/' + data.name + '/');
                }
                dfd.resolve(data);
            })
            .fail( function(data) {
                  dfd.reject(data);
            })
        return dfd.promise();
    };


    wiki.tags =  function (tagname){
        var dfd = new $.Deferred();
        // tags__slug
        // tags__slug__in
        if (tagname){
            wikiapi("/api/page_tags",{"tags__slug__in":tagname})
                .done( function(data) {
                      dfd.resolve(data);
                })
                .fail( function(data) {
                      dfd.reject(data);
                })
        } 
        else {
            wikiapi("/api/tag")
                .done( function(data) {
                      dfd.resolve(data);
                })
                .fail( function(data) {
                      dfd.reject(data);
                })
        }
        return dfd.promise();
    };



    wiki.users = function (callback,params){
        var dfd = new $.Deferred();

        wikiapi("/api/user")
            .done( function(data) {
                dfd.resolve(data);
            })
            .fail( function(data) {
                  dfd.reject(data);
            })
        return dfd.promise();
    };

    wiki.map = function(resource) {
        var dfd = new $.Deferred();
        
        if (resource){
            wikiapi(resource)
                .done( function(data) {
                      dfd.resolve(data);
                })
                .fail( function(data) {
                      dfd.reject(data);
                })
        }
        return dfd.promise();
    };

    wiki.next = function (resource,caller,callback){
        var dfd = new $.Deferred();
        if (resource){
            wikiapi(resource)
                .done( function(data) {
                      dfd.resolve(caller,data);
                })
                .fail( function(data) {
                      dfd.reject();
                })
            ;
        }
        return dfd.promise();
    };
    
        
    return wiki
    
}(localwiki));

