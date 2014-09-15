//
// Knockout Modal
// By: Brian M Hunt
// License: MIT
//
//
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['knockout', 'jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('knockout'), require('jquery'));
  } else {
    root.KnockoutModal = factory(root.ko, root.jQuery);
  }
}(this, function (ko, $) {
  var $html = $("html");
  var TRANSITION_END = "webkitTransitionEnd oTransitionEnd otransitionend " +
    "transitionend msTransitionEnd";

  function apply_backdrop() {
    $html.addClass('kom-active');
  }

  function remove_backdrop() {
    $html.removeClass('kom-active');
  }

  var KnockoutModal = (function() {
    var KM = function KnockoutModal(template, data, options) {
      var $node = $(KnockoutModal.template)
        .appendTo(KnockoutModal.$container);

      this.template = template;
      this.data = data;
      this.options = options || {};

      ko.applyBindings(this, $node[0]);
      this.$node = $node;
      this.$content = $node.find('.kom-modal-content');
      this.$node.on('click', '.kom-close', on_close_click.bind(this))

      this.display = ko.observable();
      this.display.subscribe(this.on_display_change, this);
      this.display(this.options.show != false)
    }

    KM.prototype.activate = function () {
      apply_backdrop();
    };

    KM.prototype.deactivate = function () {
      var node = this.$node
      remove_backdrop();
      node.addClass('kom-remove-animation')
        .one(TRANSITION_END, function () { node.remove() });
    };

    KM.prototype.on_display_change = function (display) {
      display ? this.activate() : this.deactivate();
    };

    function on_close_click() {
      this.deactivate();
    }

    return KM;
  })();

  // Globals
  KnockoutModal.$container = $(document.body);
  KnockoutModal.template = $("#kom-template").html();
  return KnockoutModal;
}));
