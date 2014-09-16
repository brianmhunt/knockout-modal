//
// Knockout Modal
// Demo/Specs
//

var nest_count = 0;

var ipsum = (
  "Seamlessly provide   access to scalable e-tailers for interoperable" +
  "web-readiness. Uniquely   customize economically sound initiatives" +
  "vis-a-vis sustainable models.   Interactively enhance technically sound" +
  "bandwidth through resource maximizing   users. Dynamically reinvent" +
  "turnkey vortals whereas interactive partnerships.   Quickly target 24/7" +
  "paradigms via worldwide leadership.\n" +

  "Globally matrix team driven interfaces without collaborative scenarios." +
  "Continually transform an expanded array of data without end-to-end ROI." +
  "Professionally transition economically sound communities vis-a-vis just" +
  "in time value. Competently develop inexpensive potentialities after" +
  "reliable e-tailers. Authoritatively procrastinate clicks-and-mortar" +
  "markets through standards compliant catalysts for change.\n" +

  "Globally matrix team driven interfaces without collaborative scenarios." +
  "Continually transform an expanded array of data without end-to-end ROI." +
  "Professionally transition economically sound communities vis-a-vis just" +
  "in time value. Competently develop inexpensive potentialities after" +
  "reliable e-tailers. Authoritatively procrastinate clicks-and-mortar" +
  "markets through standards compliant catalysts for change.\n" +

  "Globally matrix team driven interfaces without collaborative scenarios." +
  "Continually transform an expanded array of data without end-to-end ROI." +
  "Professionally transition economically sound communities vis-a-vis just" +
  "in time value. Competently develop inexpensive potentialities after" +
  "reliable e-tailers. Authoritatively procrastinate clicks-and-mortar" +
  "markets through standards compliant catalysts for change.\n" +

  "Collaboratively network resource sucking e-commerce rather than" +
  "e-business mindshare. Dynamically impact turnkey e-business via" +
  "value-added."
).split('\n');

var view_model = {
  open_basic_click: function () {
    var data = {
      Alpha: ko.observable('One'),
    };
    new KnockoutModal('test-basic', data, {show: true});
  },

  open_scroll_click: function () {
    var data = { ipsum: ipsum };
    new KnockoutModal('test-scroll', data, {show: true, classes: 'narrow'});
  },

  open_nested_click: function () {
    var data = {
      count: nest_count++,
      open_click: view_model.open_nested_click,
    };
    new KnockoutModal('test-nested', data, {
      show: true,
      afterClose: function () { nest_count-- },
    });
  },

  open_history_click: function () {
    var data = {
      count: nest_count++,
      open_click: view_model.open_history_click,
    };

    var kom = new KnockoutModal('test-nested', data, {
      show: true,
      afterClose: function () {
        if (history.state) {
          history.back();
        }
      }
    });

    var state = {
      idx: kom.index(),
      template: 'test-nested',
    };

    history.pushState(state);
  }
};

$(window).on('popstate', function () {
  if (!history.state) {
    return;
  }
  KnockoutModal.at(history.state.index);
});

ko.applyBindings(view_model);
