var moment = require('moment')

module.exports = function (d) {
  return moment(d).toNow(true)
}
