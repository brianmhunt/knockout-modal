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
  var stack, at;

  $(document.body).on('click', '.kom-modal', function (evt) {
    console.log("dbC");
    var class_list = evt.target.classList;
    if (class_list.contains("kom-modal") || class_list.contains("kom-dialog")) {
      modals = stack();
      if (modals.length > 0) {
        modals[modals.length - 1].remove()
      }
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
        return stack().indexOf(this) == at();
      }, this);

      this.active_class = ko.pureComputed(function () {
        return this.is_active() ? 'kom-active' : 'kom-inactive';
      }, this);

      stack.splice(at() + 1).forEach(function (kom) {
        kom.remove();
      });
      at(stack.push(this) - 1);
      ko.applyBindings(this, $node[0]);
    }

    KM.prototype.remove = function () {
      var node = this.$node;
      var callback = this.options.after_close;
      stack.remove(this);
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
      return stack.indexOf(this);
    }

    function on_close_click(evt) {
      var callback = this.options.on_close_click;
      at(at() - 1);
      if (typeof callback == 'function') {
        callback(evt);
      }
      return false;
    }

    at = KM.at = ko.observable();
    stack = KM.stack = ko.observableArray();

    at.subscribe(function(at_) {
      if (at_ >= 0) {
        $html.addClass('kom-active');
      } else {
        $html.removeClass('kom-active');
      }
    });

    return KM;
  })();

  // Globals
  KnockoutModal.$container = $(document.body);
  KnockoutModal.template = $("#kom-template").html();
  return KnockoutModal;
}));
