"use strict";
jQuery(document).ready(function() {

// set the localwiki url before anything else can happen

    // localwiki.url("https://trianglewiki.org");
    
    localwiki.url("http://www.tulsawiki.org");


//html render funcions
    var objectas_listitems = function (obj){
        var
        li_html="";
        for (var p in obj){
            li_html+="<li id='"+p+"'><strong>"+p+"</strong>:&nbsp;"+obj[p]+"</li>"        
        };
        return li_html;
    };
    
    var objectas_html = function (obj){
        var
        li_html="";
        for (var p in obj){
            li_html+="<strong>"+p+"</strong>:&nbsp;"+obj[p]+"</br>"        
        };
        return li_html;
    };
    
    var objectsetas_listitems = function (obj,link_uri,link_name){
        var pages_html="",
            pages=obj.objects;

        link_name = ((link_name in pages[0]) && link_name) || "name";
        link_uri  = ((link_uri  in pages[0]) && link_uri)  || "resource_uri";

        for (var p=0; p < pages.length; p++){
             pages_html+="<li><a\
             data-resource_uri='"+pages[p][link_uri]+"'>\
             "+pages[p][link_name]+"</a></li>"        
        };
        return pages_html;
    };

    var tour_listitems = function (tour_page,link_uri,link_name){
        var tour_html="";
        var tour_list = $(tour_page.content).filter("h2").nextAll().filter("ol");
        tour_html="<li />"
        $("li",tour_list).each(function (idx){
            var a_html = $('<div>').append($('a',this).clone()).remove().html();

            tour_html += "<li>"+a_html+"</li>"
            
        });


        return tour_html;
    };




// app functions
   
    var detail_click = function(event) {
        event.preventDefault();
        var this_uri=$(this).data('resource_uri'),display_page;
        
        if (event.data) {
            display_page = event.data.display_page || "page_detail"
        } else {
            display_page = "page_detail"
        }
        
        //this is a cheat since jqm doesn't allow easy passing of state from page through # redirects
        localwiki.current_page(this_uri);
        $.mobile.changePage("#"+display_page);
    };
    
    var add_more_link = function (listview,resource){
        $("li:last-child",listview).after("<li>\
        <a class='ui-link wiki-paginate' data-wiki-next='"+resource+"' >More</a></li>")
        $(".wiki-paginate").on ("click",next_page); 
    };
    var next_page = function (event){
        event.preventDefault();
        $.mobile.loading( 'show', {
            text: 'Getting more',
            textVisible: true,
        })
        var next=$(this).data("wiki-next"),
            calling_list=$(this).parents("[data-role='listview']");
            
        localwiki.next(next,calling_list)
            .done(function(caller,obj){
                caller.html(objectsetas_listitems(obj,"username"));
                $("li a",caller).on('click', detail_click);    
                $(".wiki-paginate").click(next_page); 
                add_more_link(caller,obj.meta.next);
                caller.listview('refresh').trigger( "create" );
                $.mobile.loading('hide');
            })
            .fail(function(){
                $.mobile.loading('hide');
            });            
    };
    
//jqm page behavior     
    
    $("#page_detail").on("pageshow",function(){
        localwiki.page(localwiki.current_page())
            .done(function(obj){
                $("#page_title").text(obj.name);
                $("#detailist").html(objectas_listitems(obj)).listview('refresh').trigger( "create" );  
                localwiki.map(obj.map)
                    .done(function (data) {
                        $("#detailist li:first-child").before("<li><div id=><div id='map_content' data-role='content'></div></div></li>");
                        var ttown= ttown || new tulsa_map(document.getElementById("map_content"));
                        var geoJSONlist=data.geom.geometries;
                        addGeomteries(geoJSONlist,ttown);
                        }
                    );//end map done
        });//end page done
    });
    
    var posWatchID,
    posOptions = {
      enableHighAccuracy: true,
    };
    
    
    $("#tour_detail").on("pageshow",function(){
            localwiki.page(localwiki.current_page())
                .done(function(obj){
                    $("#page_title").text(obj.name);
                    
                    $("#tourlist").html(tour_listitems(obj));  
                    localwiki.map(obj.map)
                        .done(function (data) {
                            $("#tourlist li:first-child").before("<li><div id=><div id='map_content' data-role='content'></div></div></li>");
                            var ttown= ttown || new tulsa_map(document.getElementById("map_content"));
                            addGeomteries(data.geom.geometries,ttown);
                            posWatchID = posWatchID || navigator.geolocation.watchPosition(ttown.posChange, ttown.posFail, posOptions);
                            
                            }
                        
                        );//end map done
                        
                });//end page done
            $("#tourlist").listview('refresh').trigger( "create" );
        });

        $("#tour_detail").on("pagehide",function(){
            
            
            navigator.geolocation.clearWatch(posWatchID);
            
            
        });

    
    
    $("#pages").on("pageinit",function(){
        localwiki.pages()
            .done(
                function(obj){
                    $("#pagelist").html(objectsetas_listitems(obj,"resource_uri","name"));
                    $("#pages li a").on('click', detail_click);                
                    add_more_link($("#pagelist"),obj.meta.next);
                    $("#pagelist").listview('refresh').trigger( "create" );  

                });            
    });   
    
    $("#tags").on("pageinit",function(){
        // localwiki.uri("/api/map/",{"page__page_tags__tags__slug__icontains":"localtour"}).done(function(data){
        //     debugger;
        // })
        // localwiki.uri("/api/page/",{"slug__icontains":"Running"}).done(function(data){
        //     debugger;
        // })
    
        localwiki.tags()
            .done(
                function(obj){
                    $("#taglist").html(objectsetas_listitems(obj,null,"name"));
                    $("#tags li a").on('click', detail_click);
                    add_more_link($("#taglist"),obj.meta.next);
                    $("#taglist").listview('refresh').trigger( "create" );                              
                });
    });    

    $("#tours").on("pageinit",function(){
        localwiki.pages({"page_tags__tags__slug__icontains":"localtour"}).
            done(function(obj){
                $("#localtours").html(objectsetas_listitems(obj,"page","name"));
                $("#localtours li a").on('click',{"display_page":"tour_detail"}, detail_click);    
                add_more_link($("#localtours"),obj.meta.next);
                $("#localtours").listview('refresh').trigger( "create" );
            })
    });


}); //end document ready

