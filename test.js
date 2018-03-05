const { assert } = require('chai');
const assertChange = require('./index');

describe('quantifiers', function() {
  describe('[by]', function() {
    it('lets me test a single side-effect', function() {
      let x = 0;

      assertChange({
        fn: () => x++,
        of: () => x,
        by: 1
      })
    })

    it('lets me define a tracing label', function() {
      let x = 0;

      assert.throws(() => {
        assertChange({
          message: 'it changes the value of X',
          fn: () => x,
          of: () => x,
          by: 1
        })
      }, 'Expected value to change from 0 to 1 but it now is 0 (it changes the value of X)')
    })
  })

  describe('[from,to]', function() {
    it('lets me test a single side-effect', function() {
      let x = 0;

      assertChange({
        fn: () => x++,
        of: () => x,
        from: 0,
        to: 1
      })
    })

    it('lets me define a tracing label', function() {
      let x = 0;

      assert.throws(() => {
        assertChange({
          message: 'it changes the value of X',
          fn: () => x,
          of: () => x,
          from: 0,
          to: 1
        })
      }, 'Expected value to become 1 but instead became 0 (it changes the value of X)')
    })
  })

  describe('[using]', function() {
    it('accepts a custom assertion', function(done) {
      let x = 0

      assertChange({
        fn: () => { x += 1 },
        of: () => x,
        using: (a, b) => {
          assert.equal(a, 0)
          assert.equal(b, 1)
          done()
        }
      })
    })
  })

  context('when no quantifier is specified...', function() {
    it('passes if the objects are deeply-equal', function() {
      assertChange({
        fn: () => {},
        of: () => ([ 'a' ])
      })
    })

    it('fails otherwise', function() {
      let x = 0;

      assert.throws(() => {
        assertChange({
          fn: () => x,
          of: () => x
        })
      }, 'expected 0 to not equal 0')
    })
  })
})

it('lets me test multiple side-effects', function() {
  let x = 0
  let y = 0

  assertChange({
    fn: () => x++,
    in: [
      {
        of: () => x,
        by: 1
      },
      {
        of: () => y,
        by: 0
      }
    ]
  })
})

it('uses [message] to define a tracing label for a side-effect', function() {
  let x = 0;

  assert.throws(() => {
    assertChange({
      message: 'it changes the value of X',
      fn: () => x,
      of: () => x
    })
  }, 'it changes the value of X')
})

it('uses [it] to define a tracing label for a side-effect', function() {
  let x = 0;

  assert.throws(() => {
    assertChange({
      it: 'it changes the value of X',
      fn: () => x,
      of: () => x
    })
  }, 'it changes the value of X')
})

context('yielded a promise...', function() {
  it('runs the assertions once it resolves', function() {
    let called = false

    return assertChange({
      fn: () => new Promise(resolve => {
        setTimeout(() => {
          called = true
          resolve()
        }, 5)
      }),
      of: () => called,
      from: false,
      to: true
    })
  })

  it('yields the promise back', function() {
    const returnValue = assertChange({
      fn: () => Promise.resolve(),
      of: () => null,
      from: null,
      to: null
    })

    assert(returnValue instanceof Promise)

    return returnValue;
  })

  it('propagates the value as-is', function() {
    const value = {}

    return assertChange({
      fn: () => Promise.resolve(value),
      of: () => null,
      from: null,
      to: null
    }).then(x => {
      assert(x === value)
    });
  })
})

describe('API invariants', function() {
  it('whines if "fn" is not defined', function() {
    assert.throws(() => {
      assertChange({
        of: () => null
      })
    }, 'Must define the "fn" property to apply the side-effects.')
  })

  it('whines if "in" is defined but is empty', function() {
    assert.throws(() => {
      assertChange({
        fn: () => null,
        in: []
      })
    }, 'Must define the "in" property to contain at least one side-effect test.')
  })

  it('whines if "of" is not defined', function() {
    assert.throws(() => {
      assertChange({
        fn: () => null
      })
    }, 'Must define the "of" property to test the side-effect.')
  })

  it('whines if "of" is not a function', function() {
    assert.throws(() => {
      assertChange({
        fn: () => null,
        of: null,
      })
    }, 'Must define the "of" property as a function to test the side-effect.')
  })

  it('whines about unrecognized test properties', function() {
    assert.throws(() => {
      assertChange({
        fn: () => null,
        of: () => {},
        frm: null,
        usng: null
      })
    }, 'Unrecognized properties ["frm","usng"].')
  })

  const variants = [
    null,
    undefined,
    'a',
    5,
    []
  ];

  variants.forEach(variant => {
    it(`whines if passed "${JSON.stringify(variant)}" for input`, function() {
      assert.throws(() => {
        assertChange(variant)
      }, 'Assertion is missing or malformed!')
    })
  })
})