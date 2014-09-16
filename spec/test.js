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
    new KnockoutModal('test-basic', data);
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
    new KnockoutModal('test-nested', data);
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
      show: true,
      on_show: function (kom) {
        if (kom._is_on_history_stack) {
          return;
        }
        console.log("PUSHSTATE", kom.index(), "history is", history.state);
        history.pushState({ index: kom.index() }, '', '#' + kom.index());
        kom._is_on_history_stack = true;
      },
      pop: function () {
        console.log("BACK");
        // popstate handler takes care of putting us at the right index.
        history.back();
      },
    });

    history.pushState({ index: kom.index() });
  },
};

$(window).on('popstate', function (evt) {
  console.log("POPSTATE", history.state);
  if (!history.state) {
    KnockoutModal.at(-1);
    return;
  }
  KnockoutModal.at(history.state.index - 1);
});

$(document.body).on('click', '[data-kom-toggle]', function (evt) {
  var template = $(evt.target).attr('data-kom-toggle');
  var $data = ko.dataFor(evt.target);
  new KnockoutModal(template, $data);
});

ko.applyBindings(view_model);
