define([ "backbone", "avgrund" ], function(Backbone){
	var View = Backbone.View.extend({
		"el": "#menuList",
		"events": {
			"click li": "itemClickHandler"
		},
		"itemClickHandler": function(){
			Avgrund.show("#default-popup");
		}
	});

	return View;
});