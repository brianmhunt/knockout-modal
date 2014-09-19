/*!
  Knockout Modal
  By: Brian M Hunt
  License: MIT
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['knockout'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('knockout'));
  } else {
    root.KnockoutModal = factory(root.ko);
  }
}(this, function (ko) {
  var stack, at;
  var KnockoutModal = (function() {
    var KM = function KnockoutModal(template, data, options) {
      this.options = options || {};
      var classes = this.options.classes || '';
      this.on_hide_cb = this.options.on_hide || function () {};
      this.on_show_cb = this.options.on_show || function () {};
      this.pop = this.options.pop || function () { at(at() - 1); };
      this.is_active = ko.computed({
        read: function () { return this.index() == at() },
        owner: this,
        deferEvaluation: true,
        pure: true,
      });

      this.css = ko.pureComputed(function () {
        return classes + ' ' + (this.index() == at() ? 'kom-show' : 'kom-hide');
      }, this);

      stack.splice(at() + 1);
      at(at() + 1);
      this.on_show();

      this.render_future = Promise.resolve(data)
        .then(this.render.bind(this, template))
        .catch(console.error.bind(console))
    }
    KM.at = at = ko.observable(-1);
    KM.stack = stack = ko.observableArray();
    KM.prototype.index = function () { return stack.indexOf(this); }
    KM.prototype.on_close_click = function() { this.pop.call(this); }
    KM.prototype.render = function (template, data) {
      this.data = data;
      this.template = template;
      stack.push(this);
    };
    KM.prototype.on_show = function () {
      var subscr;
      this.on_show_cb(this);
      subscr = at.subscribe(function (now_at) {
        if (now_at != this.index()) {
          this.on_hide_cb(this);
          subscr.dispose();
        }
      }, this)
    };
    KM.current = function () { return stack()[at()]; }
    at.subscribe(function(at_) {
      var current = KM.current();
      this.toggle('kom-active', at_ >= 0);
      if (current) {
        current.on_show(current);
      }
    }, document.documentElement.classList);
    return KM;
  })();

  function on_modal_click(evt) {
    var kom;
    if (!evt.target.hasAttribute('data-kom-close')) {
      return
    }
    evt.stopPropagation();
    if (kom = KnockoutModal.current()) {
      kom.pop();
    }
  }

  var bh = ko.bindingHandlers;
  bh.KnockoutModal = {
    init: function (e, va, a, vm, c) {
      e.addEventListener('click', on_modal_click);
      return bh.foreach.init(e, function () { return {data: stack} }, a, vm, c);
    },
    update: function (e, va, a, vm, c) {
      return bh.foreach.update(e, function () { return {data: stack} }, a, vm, c);
    }
  };
  return KnockoutModal;
}));
