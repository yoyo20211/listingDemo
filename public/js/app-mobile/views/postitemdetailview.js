// Generated by IcedCoffeeScript 1.3.1b
(function() {

  define(['jquery', 'backbone', 'underscore', 'app-mobile/models/postitems', 'app-mobile/routers/workspace', 'jade!app-mobile/templates/postitem-detail-view'], function(jQuery, Backbone, _, PostItems, Workspace, postItemDetailViewTemplate) {
    "use strict";

    var PostItemDetailView;
    PostItemDetailView = Backbone.View.extend({
      el: jQuery("#postitem-detail"),
      routers: new Workspace(),
      events: {
        "click .back": "previousPage"
      },
      initialize: function(options) {
        this.postItem = options.postitem;
        return this;
      },
      render: function() {
        var $el;
        melisting.utils.loadPrompt("Loading item...");
        $el = jQuery(this.el);
        $el.html(postItemDetailViewTemplate({
          postitem: this.postItem
        }));
        this.routers.postItemDetail();
        return this;
      },
      previousPage: function() {
        return this.routers.category();
      }
    });
    return PostItemDetailView;
  });

}).call(this);
