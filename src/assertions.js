const { assert } = require('chai')
const trace = require('./trace')
const labelOf = require('./labelOf')
const hasOwnProperty = require('./hasOwnProperty')

module.exports = [
  {
    when: spec => hasOwnProperty(spec, 'from') && hasOwnProperty(spec, 'to'),
    assert: spec => (x, y) => {
      assert.deepEqual(x, spec.from,
        trace(spec)(`Expected value to have been ${spec.from} but was ${x}`)
      )

      assert.deepEqual(y, spec.to,
        trace(spec)(`Expected value to become ${spec.to} but instead became ${y}`)
      )
    }
  },
  {
    when: spec => hasOwnProperty(spec, 'by'),
    assert: spec => (x, y) => {
      assert.equal(
        x + spec.by,
        y,
        trace(spec)(
          `Expected value to change from ${x} to ` +
          `${x + spec.by} but it now is ${y}`
        )
      )
    }
  },
  {
    when: spec => hasOwnProperty(spec, 'using'),
    assert: spec => (x, y) => {
      spec.using(x, y, labelOf(spec))
    }
  },
  {
    when: () => true,
    assert: spec => (x, y) => {
      assert.notEqual(x, y, labelOf(spec))
    }
  }
]
