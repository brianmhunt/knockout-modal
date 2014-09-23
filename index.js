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
  var bh = ko.bindingHandlers;
  var KM = function KnockoutModal(template, data, options) {
    this.options = options || {};
    this.template = template;
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
    this.data = ko.observable();
    this.loaded = ko.observable();
    this.css = ko.pureComputed(function () {
      return classes + ' ' + (this.index() == at() ? 'kom-show' : 'kom-hide');
    }, this);
    stack.splice(at() + 1);
    at(at() + 1);
    stack.push(this);
    this.render_future = Promise.resolve(data)
      .then(this.render.bind(this))
  }
  KM.at = at = ko.observable(-1);
  KM.stack = stack = ko.observableArray();
  KM.prototype.index = function () { return stack.indexOf(this); }
  KM.prototype.on_close_click = function() { this.pop.call(this); }
  KM.prototype.render = function (data) {
    this.data(data);
    this.loaded(true)
    this.on_show();
  };
  KM.prototype.on_show = function () {
    var subs = at.subscribe(function (now_at) {
      if (now_at != this.index()) {
        this.on_hide_cb(this);
        subs.dispose();
      }
    }, this)
    this.on_show_cb(this);
  };
  KM.current = function () { return stack()[at()]; }
  at.subscribe(function(at_) {
    var current = KM.current();
    document.documentElement.classList.toggle('kom-active', at_ >= 0);
    if (current) {
      current.on_show(current);
    }
  });
  bh.KnockoutModal = {
    init: function (e, va, a, vm, c) {
      e.addEventListener('click', function (evt) {
        var kom;
        if (!evt.target.hasAttribute('data-kom-close')) { return }
        evt.stopPropagation();
        if (kom = KnockoutModal.current()) { kom.pop(); }
      });
      return bh.foreach.init(e, function () { return {data: stack} }, a, vm, c);
    },
    update: function (e, va, a, vm, c) {
      return bh.foreach.update(e, function () { return {data: stack} }, a, vm, c);
    }
  };
  return KM;
}));
