## 3.0.0

_BREAKING CHANGE:_

`assertChange` is no longer the default export. It is now a named export, along with some new additions.
Please update your imports from:

```javascript
import assertChange from 'chai-assert-change'
```

to:

```javascript
import { assertChange } from 'chai-assert-change'
```

---

Additions:
- Added two new helpers, `assertBecameTrue` and `assertBecameFalse`. See readme for usage.

---

## 2.0.0

- Promises are now recognized as a return value of the side-effect function and
  the tests will defer until the promise resolves in that case.
- A new property `using` is now recognized to implement a custom assertion
  routine. Signature is defined in the README.
- Several invariants have been put in place to ensure the input structure for
  the assertion is as expected and no typos are made.
- The `message` property introduced in 1.1.0 is now superceded by the `it`
  property because it's shorter to type and one has limited keystrokes in one's
  lifetime.

---

## 1.1.0

- Support for new property "message" in specs that will be used in assertion
  error reporting.
