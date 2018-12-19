const labelOf = require('./labelOf')

// ({ ?message: String, ?it: String }): (String): String
module.exports = spec => message => {
  const label = labelOf(spec)
  return label ? `${message} (${label})` : message
}
