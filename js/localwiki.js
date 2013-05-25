"use strict";
var localwiki = (function () {
    var wiki = {},
        options={};
        
    // set default url
    options.url=options.url || 'www.tulsawiki.com'
    
    wiki.url = function (url){
        if (url){
            options.url=url;                
        }
        return options.url;        
    };
    
    wiki.current_page = function (resource_uri){
        if (resource_uri){
            options.current_page=resource_uri;                
        }
        return options.current_page;        
    };
    
    
    var wikiapi = function (resource,ajax_params){
        var dfd = new $.Deferred(),
        ajax_params=ajax_params ||{};
        // ajax_params.format='json'
        if (resource){
            $.ajax({
              type:"GET",
              url: "http://"+options.url+resource,
              data:ajax_params
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

    wiki.site = function (callback,params){
        wikiapi("/api/site").done(function(data){
           callback(data.objects[0]); 
        });
    };

    wiki.pages = function (callback,params){
        wikiapi("/api/page").done(function(data){
           callback(data); 
        });
    };
    
    wiki.page = function(resource_uri, callback, params) {
        wikiapi(resource_uri)
            .done(function(data) {
                //fully qualify src with url
                if (data.content.indexOf("src=")){
                    var src = data.content.split('src="');
                    data.content = src.join('src="http://' + options.url + '/' + data.name + '/');
                }
                callback(data);
            });
    };

    wiki.tags = function (callback,params){
        wikiapi("/api/tag").done(function(data){
           callback(data); 
        });
    };

    wiki.users = function (callback,params){
        wikiapi("/api/user",params).done(function(data){
           callback(data); 
        });
    };

    wiki.map = function(resource,callback) {

        if (resource){
            wikiapi(resource).done(function(data){
               callback(data); 
            });
        }
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

