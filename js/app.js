"use strict";
jQuery(document).ready(function() {

// set the localwiki url before anything else can happen
    
    localwiki.url("www.tulsawiki.org");


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

        link_name= ((link_name in pages[0]) && link_name) || "name";
        link_uri= ((link_uri in pages[0]) && link_uri) || "resource_uri";

        for (var p=0; p < pages.length; p++){
             pages_html+="<li><strong>"+pages[p][link_name]+"</strong>:&nbsp;<a\
             data-resource_uri='"+pages[p][link_uri]+"'>\
             "+pages[p][link_uri]+"</a></li>"        
        };
        return pages_html;
    };

// app functions
   
    var detail_click = function(event) {
        event.preventDefault();
        var this_uri=$(this).data('resource_uri')
        //this is a cheat since jqm doesn't allow easy passing of state from page through # redirects
        localwiki.current_page(this_uri);
        $.mobile.changePage("#page_detail");
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
        var next=$(this).data("wiki-next");
        calling_list=$(this).parents("[data-role='listview']")
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
        localwiki.tags("localtour").
            done(function(obj){
                $("#localtours").html(objectsetas_listitems(obj,"page","name"));
                $("#localtours li a").on('click', detail_click);    
                add_more_link($("#localtours"),obj.meta.next);
                $("#localtours").listview('refresh').trigger( "create" );
            })
    });


}); //end document ready

