var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
var moment = require('moment')
var title = require('../title')
require('select2')

qwest.setDefaultDataType('json')

var START_BUFFER = 20

var templates = {
  'index': require('./index.html.handlebars'),
  'class-pretty-name': require('./class-pretty-name.html.handlebars'),
  'student-list': require('./student-list.html.handlebars')
}

var timeInterval
var currentDivision
var divisionList = []

function updateSignInButtonState() {
  if (!currentDivision || !$('.student-select').val()) {
    $('#btnSignIn').attr('disabled', 'disabled')
  } else {
    $('#btnSignIn').removeAttr('disabled')
  }
}

function setCurrentDivision(division) {
  if ((currentDivision || { id: -1 }).id === (division || { id: -1 }).id) {
    return
  }

  currentDivision = division

  $('.current-class').html(templates['class-pretty-name'](currentDivision))
  updateSignInButtonState()

  if (currentDivision) {
    var startOfDay = moment().startOf('day') 
    var endOfDay = moment().endOf('day')

    qwest.get("/api/attendances?divisionId=" + currentDivision.id + "&signInTime[$gte]=" + startOfDay.format() + "&signInTime[$lte]=" + endOfDay.format())
      .then(function(xhr, response) {
        response.data.forEach(function(rec) {
          rec.signInTime = moment(rec.signInTime)
        })

        $('#signedInStudents').html(templates['student-list'](response.data))
      })
  } else {
    $('#signedInStudents').html(templates['student-list']([]))
  }
}

module.exports = {
  index: function() {
    title.set('Student Sign In')

    currentDivision = null
    divisionList = []

    $('#spa-target').empty().html(templates['index']({
      currentTime: moment().format('h:mm:ss a')
    }))

    qwest.get("/api/divisions?$sort[startTime]=1&dayOfTheWeek=" + moment().format('dddd'))
      .then(function(xhr, response) {
        divisionList = response.data
      })

    $(".override-select").select2({
      theme: "bootstrap"
    })

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
    }).on('change', function(e) {
      updateSignInButtonState()      
    })

    if (!timeInterval) {
      timeInterval = window.setInterval(function() {
        var now = moment()
        var nowMinutes = now.diff(moment(now).startOf('day'), 'minutes')
        var cDiv = null

        $('.current-time').html(now.format('h:mm:ss a'))

        divisionList.forEach(function(division) {
          var endBuffer = Math.ceil((division.endTime - division.startTime) * 0.25)

          if (!cDiv && division.startTime - START_BUFFER <= nowMinutes && division.endTime - endBuffer > nowMinutes) {
            cDiv = division
          }
        })

        setCurrentDivision(cDiv)
      }, 1000)
    }
  },
  signIn: function() {
    var attendance = {
      studentId: $('.student-select').val(),
      divisionId: (currentDivision || { id: null }).id,
      signInTime: moment().format(),
      status: $('.override-select').val()
    }

    if (attendance.status === 'Auto') {
      delete attendance.status
    }
    
    if (!attendance.studentId || !attendance.divisionId) {
      Aviator.navigate('/student-sign-in/')
      
      return
    }

    qwest.post("/api/attendances", attendance)
      .then(function(xhr, response) {
        var store = currentDivision
        currentDivision = null
        setCurrentDivision(store)

        Aviator.navigate('/student-sign-in/')
      })
  },
  delete: function(request) {
    qwest
      .delete("/api/attendances/" + request.namedParams.id)
      .then(function(xhr, response) {
        Aviator.navigate("/student-sign-in/")
      })
  }
}
