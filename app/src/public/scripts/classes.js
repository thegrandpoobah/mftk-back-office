var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
require('alpaca')

var templates = {
  'index': require('../classes/index.html.handlebars')
}

function onCreateClick() {
  var v = this.getValue()

  v.startTime = moment(v.startTime, 'h:mm:ss a').diff(moment(v.startTime, 'h:mm:ss a').startOf('day'), 'minutes')
  v.endTime = moment(v.endTime, 'h:mm:ss a').diff(moment(v.endTime, 'h:mm:ss a').startOf('day'), 'minutes')

  qwest
    .post("/divisions", v, {dataType: 'json', responseType: 'json'})
    .then(function(xhr, response) {
      Aviator.navigate("/admin/classes/")
    })
}

function onUpdateClick(classId) {
  var v = this.getValue()

  v.startTime = moment(v.startTime, 'h:mm:ss a').diff(moment(v.startTime, 'h:mm:ss a').startOf('day'), 'minutes')
  v.endTime = moment(v.endTime, 'h:mm:ss a').diff(moment(v.endTime, 'h:mm:ss a').startOf('day'), 'minutes')

  qwest
    .put("/divisions/" + classId, v, {dataType: 'json', responseType: 'json'})
    .then(function(xhr, response) {
      Aviator.navigate("/admin/classes/")
    })
}

module.exports = {
  index: function() {
    qwest.get('/divisions').then(function(xhr, response) {
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
    qwest.get('/divisions/' + request.namedParams.id).then(function(xhr, response) {
      response.startTime = moment().startOf('day').add(response.startTime, 'minutes').format('h:mm:ss a')
      response.endTime = moment().startOf('day').add(response.endTime, 'minutes').format('h:mm:ss a')

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
      .delete("/divisions/" + request.namedParams.id)
      .then(function(xhr, response) {
        Aviator.navigate("/admin/classes/")
      })
  }
}
