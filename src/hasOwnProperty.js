// (Object, String): Boolean
module.exports = (object, property) => (
  Object.prototype.hasOwnProperty.call(object, property)
)
