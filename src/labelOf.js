// ({ ?message: String, ?it: String }): String?
module.exports = spec => spec.message || spec.it;
