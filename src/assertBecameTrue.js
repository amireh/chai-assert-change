const assertChange = require('./assertChange')

module.exports = context => assertChange({
  ...context,
  from: false,
  to: true,
})
