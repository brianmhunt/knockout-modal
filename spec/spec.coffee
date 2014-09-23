#
# Knockout Modal Testing
# 
# -----
# FIXME!
# The following is not yet working; it has been haphazardly copied here from
# live code.
#
_ = require 'lodash'
$ = require 'jquery'
ko = require 'knockout'

require '../testing.coffee'

# modals = require '../modals.coffee'

modal_html = """
<template id='test-modal'>
<div class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        5Vh
      </div>
      <div class="modal-body">
        <p>DATA: {{$data|json}}</p>
      </div>
      <div class="modal-footer">
        6Lw
      </div>
    </div>
  </div>
</div>
</template>
"""

$container = $("#modals-transient")

describe("#{__filename}  | ModalStrategy", ->
  @timeout(1500)
  INITIAL_STATE = {type: 'test', state: 'INITIAL-ZmA'}
  modal_node = undefined
  ms = undefined
  beforeEach ->
    window.history.replaceState(INITIAL_STATE, '')
    $container.empty()
    modal_node = $(modal_html).appendTo(document.body)

  afterEach ->
    modal_node.remove()
    ms?.node?.remove()
    $(".modal-backdrop").remove()
    assert.ok(
      $container.is(":empty"),
      "#modals-transient is empty"
    )
    assert.lengthOf($(".NP-modal-transient"), 0, "transient modals")

  describe("with history disabled", ->
    beforeEach ->
      sinon.stub(ModalStrategy::, 'push_history_state', ->)

    afterEach ->
      ModalStrategy::push_history_state.restore()

    it "Copies an existing entity", ->
      ms = new ModalStrategy('test-modal', {})
      assert.lengthOf($(document.body).find(ms.node), 1)

    it "Opens the modal", ->
      ms = new ModalStrategy('test-modal', {})
      assert.ok(ms.node.data('bs.modal').isShown, 'isShown')
      assert.lengthOf(ms.node.parent(), 1)

    it "adds ModalStrategy property to .data", ->
      ms = new ModalStrategy('test-modal', {})
      assert.strictEqual(ms, ms.node.data('ModalStrategy'))

    it "binds with the data passed in", ->
      obj = {C4D: 'Ckw'}
      ms = new ModalStrategy('test-modal', obj)
      assert.strictEqual(ko.dataFor(ms.node[0]), obj)

    it "does not double-apply bindings", ->
      obj = {xhD: '2V8'}
      ms = new ModalStrategy('test-modal', obj)
      ModalStrategy.remove_all()
      ModalStrategy.restore(ms.idx)
      assert.strictEqual(ko.dataFor(ms.node[0]), obj)

    it ".created resolves when rendered", (done) ->
      obj = {nGA: 'nih'}
      ms = new ModalStrategy('test-modal', obj)
      ms.created
        .then((node) ->
          assert.strictEqual(ms.node, node)
          done()
        ).catch(done)

    it "binds the results of a promise", (done) ->
      obj = {cfN: 'bRu'}
      ms = new ModalStrategy('test-modal', Promise.resolve(obj))
      ms.created
        .then(->
          assert.strictEqual(ko.dataFor(ms.node[0]), obj)
          done()
        ).catch(done)

    it "does not bind to anything in the original template", ->
      # One could have bindings on a template, though this would
      # be convoluted.
      ms = new ModalStrategy('test-modal', {})
      assert.strictEqual(ko.dataFor(modal_node[0]), undefined)
  )

  describe('with one history step', ->
    afterEach (done) ->
      $(window).one('popstate', ->
        assert.deepEqual(window.history.state, INITIAL_STATE)
        done()
      )
      window.history.back()

    it "adds itself to the history state", ->
      ms = new ModalStrategy('test-modal', {})
      assert.equal(window.history.state.type, 'ModalStrategy')

    it "references the data in ModelStrategy.states", ->
      obj = {b2a: 'bJp'}
      ms = new ModalStrategy('test-modal', obj)
      assert.deepEqual(ms, ModalStrategy.states[ms.idx])
  )

  describe('nested modals', ->
    it "on back", (done) ->
      d1 = type: 'test', v: 'ixT'
      d2 = type: 'test', v: 'jQe'
      ms1 = new ModalStrategy('test-modal', d1)
      ms2 = new ModalStrategy('test-modal', d2)

      assert.equal($("#modals-transient .modal").length, 2)
      $container
        .on('hidden.bs.modal', _.after 2, ->
          $container.off('hidden.bs.modal')
          done()
        )

      on_pop_2 = ->
        assert.deepEqual(window.history.state, INITIAL_STATE, 'bSS')

      on_pop_1 = ->
        assert.deepEqual(window.history.state, ms1.state)
        $(window).one('popstate', on_pop_2)
        window.history.back()

      $(window).one('popstate', on_pop_1)
      window.history.back()

    it "on hide", (done) ->
      d1 = type: 'test', v: 'gLj'
      d2 = type: 'test', v: 'h1e'
      ms1 = new ModalStrategy('test-modal', d1)
      ms2 = new ModalStrategy('test-modal', d2)

      assert.equal($("#modals-transient .modal").length, 2)
      $container
        .on('hidden.bs.modal', _.after 2, ->
          $container.off('hidden.bs.modal')
          done()
        )

      on_pop_2 = ->
        assert.deepEqual(window.history.state, INITIAL_STATE, 'bSS')

      on_pop_1 = ->
        assert.deepEqual(window.history.state, ms1.state)
        $(window).one('popstate', on_pop_2)
        ms1.node.modal('hide')

      $(window).one('popstate', on_pop_1)
      ms2.node.modal('hide')
  )

  it "removes itself from the history when closed", (done) ->
    ms = new ModalStrategy('test-modal', {})
    $(window).one('popstate', ->
      assert.deepEqual(window.history.state, INITIAL_STATE)
      done()
    )
    ms.node.modal('hide')

  it "closes on the 'back' button event", (done) ->
    ms = new ModalStrategy('test-modal', {type: 'test', test: 'qme'})
    assert.equal(window.history.state.type, 'ModalStrategy')
    $(window).one('popstate', -> _.defer ->
      assert.notOk(ms.node.data('bs.modal')?.isShown)
      done()
    )
    window.history.back()

  it "reloads on the 'forward' button event"

)


describe("#{__filename}  | window.history", ->
  # Note: http://stackoverflow.com/questions/14112341
  # -- history.pushState does not trigger popstate.
  @timeout(500)

  it "history.back triggers popstate with prior state", (done) ->
    window.history.pushState(type: 'test', test:'C1P') # Original
    window.history.pushState(type: 'test', test:'JQo') # New state
    $(window).one('popstate', (evt) ->
      assert.equal(evt.originalEvent.state.test, 'C1P')
      window.history.back()  # Revert to pre-test state
      done()
    )
    window.history.back()

  it "after popstate the history.state is the new state", (done) ->
    window.history.pushState(type: 'test', test:'b9K') # Original
    window.history.pushState(type: 'test', test:'E6s') # New state
    $(window).one('popstate', (evt) ->
      assert.equal(history.state.test, 'b9K')
      window.history.back()  # Revert to pre-test state
      done()
    )
    window.history.back()
)
