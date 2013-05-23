require.config({

    baseUrl : "/public/js/src",
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
        },
        "hammer": {
            deps: ["jquery"]
        }
    }

});

require(["bootstrap", "app"], function(bootstrap, App) {

    new App();

});