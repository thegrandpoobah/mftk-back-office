var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
require('alpaca')

var templates = {
  'index': require('../curriculumLogs/index.html.handlebars')
}

module.exports = {
  index: function() {
    qwest.get('/curriculumLogs').then(function(xhr, response) {
      $('#spa-target').empty().html(templates['index'](response))
    })
  }
}
