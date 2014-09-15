//
// Knockout Modal
// By: Brian M Hunt
// License: MIT
//


// from: https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['knockout', 'jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('knockout'), require('jquery'));
    } else {
        root.returnExports = factory(root.ko, root.jQuery);
    }
}(this, function (ko, $) {
  var TEMPLATE =
    "<!-- ko template: { " +
    "name: template, data: data, if: template() && show()" +
    "} -->" +
    "<!-- /ko -->";

  var modals_showing = ko.observableArray()
  modals_showing.subscribe(on_modals_showing_change)

  function on_modals_showing_change(showing_list) {
    if (showing_list.length == 0) {
      hide_backdrop();
    } else {
      show_backdrop();
    }
  }

  function hide_backdrop() {
    console.log("HIDE BACKDROP")
  }

  function show_backdrop() {
    console.log("SHOW BACKDROP")
  }

  var KnockoutModel = (function() {
    function KnockoutModel(params) {
      this.template = params.template;
      this.data = ko.observable(params.data || {});
      this.show = params.show
      this.show.subscribe(function (show) {
        if (show) {
          modals_showing.push(this);
        } else {
          modals_showing.remove(this);
        }
      }, this)
    }

    return KnockoutModel;
  })();


  ko.components.register('knockout-modal-container', {
    viewModel: KnockoutModel,
    template: TEMPLATE,
  })
}));
