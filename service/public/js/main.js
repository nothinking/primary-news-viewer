require.config({

    baseUrl : "/public/js/src",
    paths: {
        "jquery": "../lib/jquery",
        "underscore": "../lib/underscore",
        "backbone": "../lib/backbone",
        "bootstrap" : "../lib/bootstrap",
        "moment": "../lib/moment",
        "text": "../lib/text",
        "hammer": "../lib/jquery.hammer.min",
        "circlemenu": "../lib/jquery.circlemenu",
        "kontext": "../../lib/kontext/js/kontext",
        "stroll": "../../lib/stroll.js/js/stroll"
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
        },
        "circlemenu": {
            deps: ["jquery"]
        },
        "stroll": {
            deps: ["jquery"]
        }
    }

});

require(["bootstrap", "app"], function(bootstrap, App) {

    new App();

});