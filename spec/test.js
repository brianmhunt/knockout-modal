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
    var events = {
      on_show: function (kom) {
        console.log("Showing", kom);
      },
      on_hide: function (kom) {
        console.log("Hiding", kom);
      }
    };
    new KnockoutModal('test-basic', data, events);
  },

  open_scroll_click: function () {
    var data = { ipsum: ipsum };
    new KnockoutModal('test-scroll', data, {classes: 'narrow'});
  },

  open_nested_click: function () {
    var data = {
      count: nest_count++,
      open_click: view_model.open_nested_click,
    };
    var opts = {
      on_show: function (kom) {
        console.log("Showing", kom);
      },
      on_hide: function (kom) {
        console.log("Hiding", kom);
      }
    }

    new KnockoutModal('test-nested', data, opts);
  },

  open_async_click: function () {
    var data = new Promise(function(resolve) {
      setTimeout(function () {
        resolve({ phrase: "This eventually arrives." })
      }, 1200)
    });
    $("#loading-animation").show();
    data.then(function () {
      $("#loading-animation").hide();
    });
    new KnockoutModal('test-async', data);

  },

  open_history_click: function () {
    var data = {
      at: KnockoutModal.at,
      open_click: view_model.open_history_click,
    };

    var kom = new KnockoutModal('test-history', data, {
      on_show: function (kom) {
        if (kom._is_on_history_stack) {
          return;
        }
        history.pushState({ index: kom.index() }, '', '#' + kom.index());
        kom._is_on_history_stack = true;
      },
      pop: function () {
        // popstate handler takes care of putting us at the right index.
        history.back();
      },
    });
  },
};

$(window).on('popstate', function (evt) {
  if (!history.state) {
    KnockoutModal.at(-1);
    return;
  }
  KnockoutModal.at(history.state.index);
});

$(document.body).on('click', '[data-kom-toggle]', function (evt) {
  var template = $(evt.target).attr('data-kom-toggle');
  var $data = ko.dataFor(evt.target);
  new KnockoutModal(template, $data);
});

ko.applyBindings(view_model);
