//
// Knockout Modal
// Demo/Specs
//

var nest_count = 0;

var view_model = {
  open_basic_click: function () {
    var data = {
      Alpha: ko.observable('One'),
    };
    new KnockoutModal('test-basic', data, {show: true});
  },

  open_scroll_click: function () {
    var data = {
      ipsum:
        "Seamlessly provide   access to scalable e-tailers for interoperable" +
        "web-readiness. Uniquely   customize economically sound initiatives" +
        "vis-a-vis sustainable models.   Interactively enhance technically sound" +
        "bandwidth through resource maximizing   users. Dynamically reinvent" +
        "turnkey vortals whereas interactive partnerships.   Quickly target 24/7" +
        "paradigms via worldwide leadership." +

        "Globally matrix team driven interfaces without collaborative scenarios." +
        "Continually transform an expanded array of data without end-to-end ROI." +
        "Professionally transition economically sound communities vis-a-vis just" +
        "in time value. Competently develop inexpensive potentialities after" +
        "reliable e-tailers. Authoritatively procrastinate clicks-and-mortar" +
        "markets through standards compliant catalysts for change." +

        "Globally matrix team driven interfaces without collaborative scenarios." +
        "Continually transform an expanded array of data without end-to-end ROI." +
        "Professionally transition economically sound communities vis-a-vis just" +
        "in time value. Competently develop inexpensive potentialities after" +
        "reliable e-tailers. Authoritatively procrastinate clicks-and-mortar" +
        "markets through standards compliant catalysts for change." +

        "Globally matrix team driven interfaces without collaborative scenarios." +
        "Continually transform an expanded array of data without end-to-end ROI." +
        "Professionally transition economically sound communities vis-a-vis just" +
        "in time value. Competently develop inexpensive potentialities after" +
        "reliable e-tailers. Authoritatively procrastinate clicks-and-mortar" +
        "markets through standards compliant catalysts for change." +

        "Collaboratively network resource sucking e-commerce rather than" +
        "e-business mindshare. Dynamically impact turnkey e-business via" +
        "value-added."
    };
    new KnockoutModal('test-scroll', data, {show: true});
  },

  open_nested_click: function () {
    var data = {
      count: nest_count++,
      open_click: view_model.open_nested_click,
    };
    new KnockoutModal('test-nested', data, {show: true});
  },
};

ko.applyBindings(view_model);
