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
        },
        "jqtouch": {
            deps: ["../../lib/jqtouch-1.0-b4-rc/src/jqtouch"]
        }
    }

});

require(["bootstrap", "backbone", "router", "action", "jqtouch"], function(bootstrap, Backbone, router, Action) {

    // var action = new Action({});

    router.route("", "index", function(){

        //var list = action.page("list");

        require(["article"], function(Article){
            var collection = new Article.Collection();
            var list = new Article.List({ 
                "el": "#test",
                "collection": collection
            });
            collection.fetch({"reset": true});
            window.c = collection;

            // 리스트로왔어 액션해.
            // action.page("list", list);
        });
        console.log("index");


        
    });

    router.route("view/:collection/:id", "view", function(collection, id){


        require(["article"], function(Article){
            var model = new Article.Model({
                "_id": id,
                "categoryKey": collection

            });
            var view = new Article.View({
                "model": model
            });

            // view.$el.appendTo(document.body);

            model.fetch();

            
            window.m = model;

            // 뷰로왔어 뷰 들어와.
            // action.page("view", view);
            
        });
    })

    !Backbone.History.started && Backbone.history.start({ "pushState": true });

    var jQT = new $.jQTouch({
       "icon": "jqtouch.png",
       "addGlossToIcon": false,
       "statusBar": "black-translucent"
    });
});