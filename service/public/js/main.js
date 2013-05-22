require.config({

    baseUrl : "/js/src",
    paths: {
        "jquery": "../lib/jquery",
        "underscore": "../lib/underscore",
        "backbone": "../lib/backbone",
        "bootstrap" : "../lib/bootstrap",
        "moment": "../lib/moment",
        "text": "../lib/text",
        "hammer": "../lib/jquery.hammer.min"
    },

    shim: {
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "underscore" : {
            exports : "_"
        },
        "bootstrap": {
            deps: ["jquery"]
        }
    }

});

require(["bootstrap", "backbone", "router", "action"], function(bootstrap, Backbone, router, Action) {

    // var action = new Action({});


    var _cache = {};

    router.route("", "list", function(){
        //var list = action.page("list");

        require(["article"], function(Article){
            if(_cache.list) {
                _cache.list.collection.fetch({"reset": true});
            } else {
                var collection = _cache.collection = new Article.Collection();
                var list = _cache.list = new Article.List({ 
                    "el": "#list",
                    "collection": collection
                });
                collection.fetch({"reset": true});
                window.c = collection;
            }
        });
        console.log("list");
    });

    router.route("view/:collection/:id", "view", function(collection, id, options){
        require(["article"], function(Article){
            if(_cache.view){
                _cache.view.model.set({
                    "_id": id,
                    "categoryKey": collection
                }, {
                    "silent": true
                }).fetch();

            } else {
                var model = new Article.Model({
                    "_id": id,
                    "categoryKey": collection
                });
                var view = _cache.view = new Article.View({
                    "el": "#view",
                    "model": model
                });

                // view.$el.appendTo(document.body);

                model.fetch();

                window.m = model;
            }

            // 이전 다음 기사 스와이프 처리하기,

            
        });
    });


    router.on("route", function(key, params){
        // 테스트 
        var $target = $("#" + key),
            $current = $("#jqt > .current"),
            direction = "left",
            className = "slide";

        if($target.is(".current")) {
            return;
        }

        if($current.length === 0){
            $target.addClass("current");
            return;
        }

        // $current.removeClass("current").addClass([ className, "out" ].join(" "));
        
        if($target.data("to") == $current.attr("id")){
            direction = "right";
            $current.data("to", '');
            console.log('back');
        }
        else {
            console.log('f');
            // data에 to, from 세팅
            $current.data("to", $target.attr("id"));
        }


        $current.addClass([ className + direction, "out" ].join(" "));


        $target.addClass("current");

        $target[0].offsetWidth;

        $target.addClass(className + direction + " in").one("webkitAnimationEnd animationend", function(e){
            $current.removeClass("current out " + className + direction );
            $target.removeClass("in " + className + direction );
        });


                
    });

    !Backbone.History.started && Backbone.history.start({ "pushState": true });
});