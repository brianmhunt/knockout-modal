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
  var open_modals, at;

  function apply_backdrop() {
    $html.addClass('kom-active');
  }

  function remove_backdrop() {
    if (open_modals().length == 0) {
      $html.removeClass('kom-active');
    }
  }

  $(document.body).on('click', '.kom-modal', function (evt) {
    var class_list = evt.target.classList;
    if (class_list.contains("kom-modal") || class_list.contains("kom-dialog")) {
      modals = open_modals();
      if (modals.length == 0) {
        return
      }
      modals[modals.length - 1].deactivate()
    }
  });

  var KnockoutModal = (function() {
    var KM = function KnockoutModal(template, data, options) {
      var $node = $(KnockoutModal.template)
        .appendTo(KnockoutModal.$container);

      this.template = template;
      this.data = data;
      this.options = options || {};
      this.$node = $node;
      this.$content = $node.find('.kom-modal-content');
      this.$node.on('click', '.kom-close', on_close_click.bind(this));
      if (this.options.classes) {
        this.$content.addClass(this.options.classes);
      }

      this.is_active = ko.computed(function () {
        return open_modals().indexOf(this) == at();
      }, this);

      this.active_class = ko.pureComputed(function () {
        return this.is_active() ? 'kom-active' : 'kom-inactive';
      }, this);

      this.is_active.subscribe(this.on_active_change, this);

      open_modals.push(this);
      KnockoutModal.at(open_modals().indexOf(this));
      ko.applyBindings(this, $node[0]);
    }

    KM.prototype.activate = function () {
      apply_backdrop();
    };

    KM.prototype.deactivate = function () {
      var node = this.$node;
      var callback = this.options.afterClose;
      open_modals.remove(this);
      remove_backdrop();
      at(at() - 1);
      function on_hide() {
        node.remove();
        if (typeof callback == 'function') {
          callback();
        }
      }
      node.addClass('kom-remove-animation').one(TRANSITION_END, on_hide);
    };

    KM.prototype.index = function () {
      return open_modals.indexOf(this);
    }

    KM.prototype.on_active_change = function(is_active) {
      if (is_active) {
        this.activate();
      } else {
        this.deactivate();
      }
    }

    function on_close_click() {
      this.deactivate();
    }

    at = KM.at = ko.observable();
    open_modals = KM.open_modals = ko.observableArray();
    return KM;
  })();

  // Globals
  KnockoutModal.$container = $(document.body);
  KnockoutModal.template = $("#kom-template").html();
  return KnockoutModal;
}));
