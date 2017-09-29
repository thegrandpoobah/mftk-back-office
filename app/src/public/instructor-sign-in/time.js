var moment = require('moment')

var TIME_FORMAT = 'h:mma'

module.exports = function (t) {
  return moment().startOf('day').add(t, 'minutes').format(TIME_FORMAT)
}
