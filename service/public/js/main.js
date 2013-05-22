require.config({

    baseUrl : "/js/src",
    paths: {
        "jquery": "../lib/jquery",
        "underscore": "../lib/underscore",
        "backbone": "../lib/backbone",
        "bootstrap" : "../lib/bootstrap",
        "moment": "../lib/moment",
        "text": "../lib/text",
        "jqtouch": "../../lib/jqtouch-1.0-b4-rc/src/jqtouch-jquery"
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


    // 테스트 스파게티 파티

    var test = {};

    router.route("", "list", function(){
        //var list = action.page("list");

        require(["article"], function(Article){
            if(test.list) {
                test.list.collection.fetch({"reset": true});
            } else {
                var collection = new Article.Collection();
                var list = test.list = new Article.List({ 
                    "el": "#test",
                    "collection": collection
                });
                collection.fetch({"reset": true});
                window.c = collection;
            }
            // 리스트로왔어 액션해.
            // action.page("list", list);
        });
        console.log("list");
    });

    router.route("view/:collection/:id", "view", function(collection, id, options){
        require(["article"], function(Article){
            if(test.view){
                test.view.model.set({
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
                var view = test.view = new Article.View({
                    "el": "#view",
                    "model": model
                });

                // view.$el.appendTo(document.body);

                model.fetch();

                window.m = model;
            }

            // 뷰로왔어 뷰 들어와.
            // action.page("view", view);
            
        });
    });


    router.on("route", function(key, params){
        // 테스트 
        var $target = $("#" + key),
            $current = $("#jqt > .current"),
            className = $target.attr("class") || "slideleft";

        if($target.is(".current")) {
            return;
        }

        if($current.length === 0){
            $target.addClass("current");
            return
        }

        // $current.removeClass("current").addClass([ className, "out" ].join(" "));
        
        $current.addClass([ className, "out" ].join(" "));

        $target.addClass("current");

        $target[0].offsetWidth;

        $target.addClass(className + " in").one("webkitAnimationEnd animationend", function(e){
            $current.removeClass("current out " + className );
            $target.removeClass("in");
        });
                
    });

    !Backbone.History.started && Backbone.history.start({ "pushState": true });
});