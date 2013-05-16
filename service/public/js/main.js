require.config({

    baseUrl : "/js/src",
    paths: {
        "jquery": "../lib/jquery",
        "underscore": "../lib/underscore",
        "backbone": "../lib/backbone",
        "bootstrap" : "../lib/bootstrap",
        "moment": "../lib/moment"
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

require(["backbone", "router"], function(Backbone, router) {

    router.route("", "index", function(){

        require(["article"], function(Article){
            var collection = new Article.Collection();
            collection.fetch({"reset": true});
        });
        console.log("index");
    });

    !Backbone.History.started && Backbone.history.start({ "pushState": true });
});