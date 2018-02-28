const { assert } = require('chai')
const invariant = require('invariant')

const evaluate = x => typeof x === 'function' ? x() : x
const hasOwnProperty = (object, property) => (
  Object.prototype.hasOwnProperty.call(object, property)
)

const omit = (keys, object) => object ? Object.keys(object).reduce((map, key) => {
  if (keys.indexOf(key) === -1) {
    map[key] = object[key];
  }

  return map;
}, {}) : object

/**
 * Perform an assertion against multiple side-effects caused by a function.
 *
 * @param  {Object} context
 * @param  {Object} context.fn
 *         The function that causes side-effects.
 *
 * @param  {Array.<Object>} context.in
 *         The list of side-effects to observe.
 *
 * @param  {Function} context.in[].of
 *         The function that queries the side-effects and returns a value that
 *         quantifies the effect.
 *
 * @param  {Number} context.in[].by
 *         The expected change amount, if the value is a number.
 *
 * @param  {Any} context.in[].from
 *         The initial value.
 *
 * @param  {Any} context.in[].to
 *         The expected value (after the side-effect).
 *
 * @example
 *
 *     assertMultiChange({
 *       fn: () => ajax({ url: '/foo' }),
 *       in: [
 *         {
 *           of: () => sinon.server.requests.length,
 *           by: 1
 *         },
 *         {
 *           of: () => window.location.pathname,
 *           from: '/foo.html',
 *           to: '/bar.html'
 *         }
 *       ]
 *     });
 */
function assertMultiChange(context) {
  invariant(typeof context.fn === 'function',
    "Must define 'fn' to perform side-effects.")

  invariant(hasOwnProperty(context, 'in'),
    "Must define 'of' to query side-effects.")

  const oldValues = context.in.map(x => x.of).map(evaluate)
  context.fn()
  const newValues = context.in.map(x => x.of).map(evaluate)

  context.in.forEach((spec, index) => {
    const oldValue = oldValues[index]
    const newValue = newValues[index]
    const trace = message => {
      if (spec.message) {
        return `${message} (${spec.message})`
      }
      else {
        return message
      }
    }

    if (hasOwnProperty(spec, 'from') && hasOwnProperty(spec, 'to')) {
      assert.deepEqual(oldValue, spec.from,
        trace(`Expected value to have been ${spec.from} but was ${oldValue}`)
      )

      assert.deepEqual(newValue, spec.to,
        trace(`Expected value to become ${spec.to} but instead became ${newValue}`)
      )
    } else if (hasOwnProperty(spec, 'by')) {
      assert.equal(oldValue + spec.by, newValue,
        trace(
          `Expected value to change from ${oldValue} to ` +
          `${oldValue + spec.by} but it now is ${newValue}`
        )
      )
    } else {
      assert.notEqual(oldValue, newValue, spec.message)
    }
  })
}

/**
 * Perform an assertion against a side-effect caused by a function.
 * You must specify either "by" or both "from" and "to".
 *
 * @param  {Object} context
 * @param  {Object} context.fn
 *         The function that causes side-effects.
 *
 * @param  {Object} context.of
 *         A function that queries the side-effects and returns a number that
 *         quantifies the effect.
 *
 * @param  {Number} context.by
 *         The expected change.
 *
 * @param  {Any} context.from
 *         The initial value
 *
 * @param  {Any} context.to
 *         The expected value after the side-effect
 *
 * @example
 *
 *     assertChange({
 *       fn() { ajax({ url: '/foo' }) },
 *       of() { return sinon.server.requests.length; },
 *       by: 1
 *     });
 */
function assertChange(context) {
  if (Array.isArray(context.in)) {
    assertMultiChange(context)
  }
  else {
    assertMultiChange({
      fn: context.fn,
      in: [ omit([ 'fn' ], context) ]
    })
  }
}

module.exports = assertChange