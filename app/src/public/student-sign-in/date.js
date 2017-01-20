var moment = require('moment')

module.exports = function (date, opts) {
  return moment(date).format(opts.hash.format)
}
