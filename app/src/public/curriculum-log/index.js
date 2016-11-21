var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
require('alpaca')

var templates = {
  'index': require('./index.html.handlebars'),
  'class-pretty-name': require('./class-pretty-name.html.handlebars'),
}

module.exports = {
  index: function() {
    qwest
      .get('/divisions?dayOfTheWeek=' + moment().format('dddd'))
      .then(function(xhr, response) {
        $('#spa-target').empty().html(templates['index']({
          today: moment().format('YYYY/MM/DD')
        }))

        $('.division-select').select2({
          placeholder: 'Select a class',
          theme: 'bootstrap',
          data: response.data.map(function(division) {
            return {
              id: division.id,
              text: templates['class-pretty-name'](division)
            }
          })
        })

        $(".instructor-select").select2({
          placeholder: 'Select an Instructor',
          theme: "bootstrap",
          ajax: {
            url: "/search/students",
            dataType: 'json',
            delay: 250,
            data: function (params) {
              return {
                q: params.term, // search term
                role: 'Instructor'
              };
            },
            processResults: function (data, params) {
              // parse the results into the format expected by Select2
              // since we are using custom formatting functions we do not need to
              // alter the remote JSON data, except to indicate that infinite
              // scrolling can be used
              return {
                results: data.map(function(item) {
                  return {id: item.id, text: [item.firstName, item.lastName].join(' '), data: item}
                }),
                pagination: {
                  more: false
                }
              }
            },
            cache: true
          },
          minimumInputLength: 1
        });
      })
  }
}
