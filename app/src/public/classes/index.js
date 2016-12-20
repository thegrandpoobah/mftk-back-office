var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
var Handlebars = require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
require('alpaca')

qwest.setDefaultDataType('json')

var TIME_FORMAT = 'h:mm a'

Handlebars.registerHelper({
  'time': function (t) {
    return moment().startOf('day').add(t, 'minutes').format(TIME_FORMAT)
  }
})

var templates = {
  'index': require('./index.html.handlebars')
}

function onCreateClick() {
  var v = this.getValue()

  v.startTime = moment(v.startTime, TIME_FORMAT).diff(moment(v.startTime, TIME_FORMAT).startOf('day'), 'minutes')
  v.endTime = moment(v.endTime, TIME_FORMAT).diff(moment(v.endTime, TIME_FORMAT).startOf('day'), 'minutes')

  qwest
    .post("/api/divisions", v)
    .then(function(xhr, response) {
      Aviator.navigate("/admin/classes/")
    })
}

function onUpdateClick(classId) {
  var v = this.getValue()

  v.startTime = moment(v.startTime, TIME_FORMAT).diff(moment(v.startTime, TIME_FORMAT).startOf('day'), 'minutes')
  v.endTime = moment(v.endTime, TIME_FORMAT).diff(moment(v.endTime, TIME_FORMAT).startOf('day'), 'minutes')

  qwest
    .put("/api/divisions/" + classId, v)
    .then(function(xhr, response) {
      Aviator.navigate("/admin/classes/")
    })
}

module.exports = {
  index: function() {
    qwest.get('/api/divisions?$sort[dayOfTheWeek]=1&$sort[startTime]=1').then(function(xhr, response) {
      $('#spa-target').empty().html(templates['index'](response))
    })
  },
  create: function() {
    $("#spa-target").empty().alpaca({
      "schema": require('./new-class-schema.json'),
      "options": {
        "form": {
          "buttons": {
            "submit": {
              "title": "Create",
              "click": onCreateClick
            },
            "back": {
              "title": "Back",
              "click": function() {
                Aviator.navigate("/admin/classes/")
              }
            }
          }
        },
        "fields": require('./new-class-options.json'),
      },
      "view": "bootstrap-create"
    })
  },
  edit: function(request) {
    qwest.get('/api/divisions/' + request.namedParams.id).then(function(xhr, response) {
      response.startTime = moment().startOf('day').add(response.startTime, 'minutes').format(TIME_FORMAT)
      response.endTime = moment().startOf('day').add(response.endTime, 'minutes').format(TIME_FORMAT)

      $("#spa-target").empty().alpaca({
        "data": response,
        "schema": require('./edit-class-schema.json'),
        "options": {
          "form": {
            "buttons": {
              "submit": {
                "title": "Update",
                "click": function() { return onUpdateClick.call(this, request.namedParams.id) }
              },
              "back": {
                "title": "Back",
                "click": function() {
                  Aviator.navigate("/admin/classes/")
                }
              }
            }
          },
          "fields": require('./edit-class-options.json')
        },
        "view": "bootstrap-edit"
      })
    })
  },
  delete: function(request) {
    qwest
      .delete("/api/divisions/" + request.namedParams.id)
      .then(function(xhr, response) {
        Aviator.navigate("/admin/classes/")
      })
  }
}
