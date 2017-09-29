var numeral = require('numeral')

module.exports = function (number, opts) {
  return numeral(number).format(opts.hash.format)
}
