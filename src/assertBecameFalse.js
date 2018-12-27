const assertChange = require('./assertChange')

module.exports = context => assertChange({
  ...context,
  from: true,
  to: false,
})
