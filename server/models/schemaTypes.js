
exports.Required = function(type) {
  return ({
    type: type,
    required: true
  })
}


exports.DefaultNumber = {
  type: Number,
  default: 0
}


exports.DefaultBoolean = {
  type: Boolean,
  default: false
}
