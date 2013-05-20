require.config({

    baseUrl : "/js/src",
    paths: {
        "jquery": "../lib/jquery",
        "underscore": "../lib/underscore",
        "backbone": "../lib/backbone",
        "bootstrap" : "../lib/bootstrap",
        "moment": "../lib/moment",
        "text": "../lib/text"
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

require(["bootstrap", "backbone", "router"], function(bootstrap, Backbone, router) {

    router.route("", "index", function(){

        require(["article"], function(Article){
            var collection = new Article.Collection();
            var list = new Article.List({ 
                "$el": $("#test"),
                "collection": collection
            });
            collection.fetch({"reset": true});
            window.c = collection;
        });
        console.log("index");
    });

    router.route("view/:id", "view", function(id){

        require(["article"], function(Article){
            var model = new Article.Model({
                "_id": id
            });
            var view = new Article.View({
                "model": model
            });

            view.$el.appendTo(document.body);

            model.fetch();

            
            window.m = model;
            
        });
    })

    !Backbone.History.started && Backbone.history.start({ "pushState": true });
});