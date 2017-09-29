var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
var moment = require('moment')
var title = require('../title')
require('select2')

qwest.setDefaultDataType('json')

var templates = {
  'index': require('./index.html.handlebars'),
  'instructor-list': require('./instructor-list.html.handlebars')
}

var timeInterval
var currentDay

function updateSignInButtonState() {
  if ($('.instructor-select').val()) {
    $('#btnSignIn').removeAttr('disabled')
  } else {
    $('#btnSignIn').attr('disabled', 'disabled')
  }
}

function updateSignedInInstructors() {
  var startOfDay = moment().startOf('day') 
  var endOfDay = moment().endOf('day')

  qwest.get("/api/attendances?signInTime[$gte]=" + startOfDay.format() + "&signInTime[$lte]=" + endOfDay.format())
    .then(function(xhr, response) {
      response.data.forEach(function(rec) {
        rec.signInTime = moment(rec.signInTime)
      })

      response.data = response.data.reduce(function(acc, rec) {
        if (!rec.divisionId) {
          acc.push(rec)
        }
        return acc
      }, [])

      $('#signedInInstructors').html(templates['instructor-list'](response.data))
    })
}

module.exports = {
  index: function() {
    title.set('Instructor Sign In')

    $('#spa-target').empty().html(templates['index']({
      currentTime: moment().format('h:mm:ss a')
    }))

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
    }).on('change', function(e) {
      updateSignInButtonState()
    })

    if (!timeInterval) {
      timeInterval = window.setInterval(function() {
        var now = moment()
        var nowMinutes = now.diff(moment(now).startOf('day'), 'minutes')

        if (currentDay !== now.dayOfYear()) {
          updateSignedInInstructors()

          currentDay = now.dayOfYear()
        }

        $('.current-time').html(now.format('h:mm:ss a'))
      }, 1000)
    }
  },
  signIn: function() {
    var attendance = {
      studentId: $('.instructor-select').val(),
      signInTime: moment().format(),
      status: 'Early'
    }

    if (!attendance.studentId) {
      Aviator.navigate('/instructor-sign-in/')
      
      return
    }

    qwest.post("/api/attendances", attendance)
      .then(function(xhr, response) {
        updateSignedInInstructors()

        Aviator.navigate('/instructor-sign-in/')
      })
  },
  delete: function(request) {
    qwest
      .delete("/api/attendances/" + request.namedParams.id)
      .then(function(xhr, response) {
        updateSignedInInstructors()

        Aviator.navigate("/instructor-sign-in/")
      })
  }
}
