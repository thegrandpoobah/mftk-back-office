var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
var Handlebars = require('handlebars/runtime')
var moment = require('moment')
require('select2')

var TIME_FORMAT = 'h:mma'

Handlebars.registerHelper({
  'time': function (t) {
    return moment().startOf('day').add(t, 'minutes').format(TIME_FORMAT)
  }  
})

var templates = {
  'index': require('./index.html.handlebars'),
  'class-pretty-name': require('./class-pretty-name.html.handlebars')
}

var timeInterval
var currentDivision
var divisionList = []

module.exports = {
  index: function() {
    $('#spa-target').empty().html(templates['index']({
      currentTime: moment().format('h:mm:ss a')
    }))

    qwest.get("/divisions?dayOfTheWeek=" + moment().format('dddd'))
      .then(function(xhr, response) {
        divisionList = response.data
      })

    $(".student-select").select2({
      placeholder: 'Select a Student',
      theme: "bootstrap",
      ajax: {
        url: "/search/students",
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

    if (!timeInterval) {
      timeInterval = window.setInterval(function() {
        var now = moment()

        $('.current-time').html(now.format('h:mm:ss a'))

        currentDivision = null

        nowMinutes = now.diff(moment(now).startOf('day'), 'minutes')

        divisionList.forEach(function(division) {
          if (division.startTime - 10 <= nowMinutes && division.endTime - 10 >= nowMinutes) {
            currentDivision = division
          }
        })

        $('.current-class').html(templates['class-pretty-name'](currentDivision))
      }, 1000)
    }
  },
  signIn: function() {
    var attendance = {
      studentId: $('.student-select').val(),
      divisionId: currentDivision.id,
      signInTime: moment().format()
    }

    qwest.post("/attendances", attendance, {dataType: 'json', responseType: 'json'})
      .then(function(xhr, response) {
        Aviator.navigate('/student-sign-in/').refresh()
      })
  }
}
