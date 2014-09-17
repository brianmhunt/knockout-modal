/*!
  Knockout Modal
  By: Brian M Hunt
  License: MIT
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['knockout', 'jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('knockout'), require('jquery'));
  } else {
    root.KnockoutModal = factory(root.ko, root.jQuery);
  }
}(this, function (ko, $) {
  var stack, at;
  var $html = $("html");
  var TRANSITION_END = "webkitTransitionEnd oTransitionEnd otransitionend " +
    "transitionend msTransitionEnd";
  var KnockoutModal = (function() {
    var KM = function KnockoutModal(template, data, options) {
      this.template = null;
      this.options = options || {};
      this.pop = this.options.pop || function () { at(at() - 1); };
      var on_hide = this.options.on_hide || null;
      var on_show = this.options.on_show || null;

      this.is_active = ko.computed(function () { return this.index() == at() }, this);

      if (on_hide || on_show) {
        this.is_active.subscribe(function (is_active) {
          is_active ? (on_show ? on_show(this) : null) : (on_hide ? on_hide(this) : null);
        }, this);
      }

      this.css = ko.pureComputed(function () {
        var classes = this.options.classes || '';
        return classes + ' ' + (this.index() == at() ? 'kom-show' : 'kom-hide');
      }, this);

      stack.splice(at() + 1);
      at(at() + 1);

      this.render_future = Promise.resolve(data)
        .then(this.render.bind(this, template))
        .catch(console.error.bind(console))
    }

    KM.at = at = ko.observable(-1);
    KM.stack = stack = ko.observableArray();

    KM.prototype.index = function () { return stack.indexOf(this); }
    KM.prototype.on_close_click = function() { this.pop(); }
    KM.prototype.render = function (template, data) {
      this.data = data;
      this.template = template;
      stack.push(this);
    }

    // Add kom-active to <html>
    at.subscribe(function(at_) { $html.toggleClass('kom-active', at_ >= 0) });

    return KM;
  })();

  function on_close_click(vm, evt) {
    var kom;
    if (evt.target.classList.contains('kom-modal') ||
        evt.target.classList.contains('kom-box')) {
      kom = KnockoutModal.stack()[at()];
      if (kom) { kom.pop(); }
    }
  }

  var bh = ko.bindingHandlers;
  bh.KnockoutModal = {
    init: function (e, va, a, vm, c) {
      bh.foreach.init(e, function () { return {data: stack} }, a, vm, c);
      bh.click.init(e, function () { return on_close_click }, a, vm, c);
    },
    update: function (e, va, a, vm, c) {
      bh.foreach.update(e, function () { return {data: stack} }, a, vm, c);
    }
  };

  // Globals
  KnockoutModal.$container = $(document.body);
  KnockoutModal.template = $("#kom-template").html();
  return KnockoutModal;
}));
