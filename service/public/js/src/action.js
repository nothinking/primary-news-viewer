define(["backbone"], function(Backbone){

	var Action = Backbone.View.extend({
		el: document.body,
		map : {},
		currentPage: null,
		page : function( key, view, options) {
			view = view || this.map[key];
			
			this.hide();
			
			this.$el.append(view.$el);
			
			this.currentPage = view;
			
			this.show();

			return view;
		},
		hide: function(view){
			view = view || this.currentPage;
			view && view.$el.hide();
		},
		show: function(view){
			view = view || this.currentPage;
			view && view.$el.show();
		}
	});


	return Action;

});