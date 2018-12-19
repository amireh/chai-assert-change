const invariant = require('invariant')
const assertions = require('./assertions')
const hasOwnProperty = require('./hasOwnProperty')
const tap = require('./tap')

// (function(): Any): Any
const evaluate = x => x()

const Index = {
  // (String[]): Object
  of: list => list.reduce((map, x) => {
    map[x] = 1
    return map
  }, {}),

  // (Object, String[]): String[]
  difference: (index, list) => list.filter(x => index[x] !== 1)
}

const KnownTestProperties = Index.of([
  'by',
  'from',
  'it',
  'message',
  'of',
  'to',
  'using',
])

function assertMultiChange(context) {
  const specs = context.in;

  invariant(typeof context.fn === 'function',
    'Must define the "fn" property to apply the side-effects.'
  )

  invariant(Array.isArray(specs),
    'Must define the "in" property with the side-effect tests.'
  )

  invariant(specs.length > 0,
    'Must define the "in" property to contain at least one side-effect test.'
  )

  specs.forEach(spec => {
    invariant(hasOwnProperty(spec, 'of'),
      'Must define the "of" property to test the side-effect.'
    )

    invariant(typeof spec.of === 'function',
      'Must define the "of" property as a function to test the side-effect.'
    )

    const unrecognizedProperties = Index.difference(KnownTestProperties, Object.keys(spec))

    invariant(unrecognizedProperties.length === 0,
      `Unrecognized properties ${JSON.stringify(unrecognizedProperties)}.`
    )
  })

  const xs = specs.map(x => x.of).map(evaluate)
  const returnValue = context.fn()
  const runAssertions = () => {
    const ys = specs.map(x => x.of).map(evaluate)

    context.in.forEach((spec, index) => {
      assertions
        .find(x => x.when(spec))
        .assert(spec)(
          xs[index],
          ys[index]
        )
      ;
    })
  }

  if (returnValue && typeof returnValue.then === 'function') {
    return returnValue.then(tap(runAssertions))
  } else {
    return runAssertions()
  }
}

module.exports = assertMultiChange
