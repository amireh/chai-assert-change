const invariant = require('invariant')
const assertMultiChange = require('./assertMultiChange')

// (String[], Object): Object
const omit = (keys, object) => Object.keys(object).reduce((map, key) => {
  if (keys.indexOf(key) === -1) {
    map[key] = object[key]
  }
  return map
}, {})

function assertChange(context) {
  invariant(context && typeof context === 'object' && !Array.isArray(context),
    'Assertion is missing or malformed!'
  )

  if (!Array.isArray(context.in)) {
    return assertMultiChange({
      fn: context.fn,
      in: [ omit([ 'fn' ], context) ]
    })
  }

  return assertMultiChange(context)
}

module.exports = assertChange
