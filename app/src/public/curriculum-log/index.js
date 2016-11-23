var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
var Handlebars = require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
require('alpaca')

Handlebars.registerHelper({
  'date': function (date, opts) {
    return moment(date).format(opts.hash.format)
  }
})

var templates = {
  'index': require('./index.html.handlebars'),
  'class-pretty-name': require('./class-pretty-name.html.handlebars'),
}

module.exports = {
  index: function() {
    qwest
      .get('/divisions?dayOfTheWeek=' + moment().format('dddd'))
      .get('/curriculumLogs?$sort[createdAt]=1&type=Tiny%20Tigers')
      .get('/curriculumLogs?$sort[createdAt]=1&type=Children')
      .get('/curriculumLogs?$sort[createdAt]=1&type=Adults')
      .get('/curriculumLogs?$sort[createdAt]=1&type=Demo%20Team')
      .get('/curriculumLogs?$sort[createdAt]=1&type=Olympic%20Sparring')
      .then(function(responses) {
        $('#spa-target').empty().html(templates['index']({
          'tiny-tigers': responses[1][1].data,
          'children': responses[2][1].data,
          'adults': responses[3][1].data,
          'demo-team': responses[4][1].data,
          'olympic-sparring': responses[5][1].data
        }))

        $('.division-select').select2({
          placeholder: 'Select a class',
          theme: 'bootstrap',
          data: responses[0][1].data.map(function(division) {
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
  },
  create: function() {
    var cl = {}

    cl.divisionId = $('.division-select').val()
    cl.instructorId = $('.instructor-select').val()
    cl.poomsaeForms = $('.cl-form .pf-checkbox').is(':checked')
    cl.appreciationForms = $('.cl-form .af-checkbox').is(':checked')
    cl.selfDefense = $('.cl-form .sd-checkbox').is(':checked')
    cl.stepSparring = $('.cl-form .ss-checkbox').is(':checked')
    cl.extra = $('.cl-form .notes-input').val()

    qwest
      .post('/curriculumLogs', cl, {dataType: 'json', responseType: 'json'})
      .then(function(xhr, response) {
        Aviator.navigate('/curriculum-log/')
      })
  }
}
