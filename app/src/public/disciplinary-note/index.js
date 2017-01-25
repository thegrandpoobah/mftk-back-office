var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
var title = require('../title')
require('handlebars/runtime')
require('select2')

qwest.setDefaultDataType('json')

var templates = {
  'index': require('./index.html.handlebars')
}

module.exports = {
  index: function() {
    title.set('New Disciplinary Note')
    
    $('#spa-target').empty().html(templates['index']())

    $(".student-select").select2({
      placeholder: 'Select a Student',
      theme: "bootstrap",
      ajax: {
        url: "/api/search/students",
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {
            q: params.term, // search term
            role: 'Student'
          };
        },
        processResults: function (data, params) {
          // parse the results into the format expected by Select2
          // since we are using custom formatting functions we do not need to
          // alter the remote JSON data, except to indicate that infinite
          // scrolling can be used
          return {
            results: data.map(function(item) {
              return {
                id: item.id,
                text: [item.firstName, item.lastName].join(' '),
                data: item
              }
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

    $(".instructor-select").select2({
      placeholder: 'Select an Instructor',
      theme: "bootstrap",
      ajax: {
        url: "/api/search/students",
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
              return {
                id: item.id,
                text: [item.firstName, item.lastName].join(' '),
                data: item
              }
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
  },
  create: function() {
    var note = {
      studentId: $('.student-select').val(),
      instructorId: $('.instructor-select').val(),
      text: $('.note').val()
    }

    qwest.post("/api/notes", note).then(function(xhr, response) {
      Aviator.navigate('/disciplinary-note/').refresh()
    })
  }
}
