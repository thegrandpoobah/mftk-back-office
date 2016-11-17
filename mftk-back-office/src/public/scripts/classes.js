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

module.exports = {
  index: function() {
    qwest.get('/divisions').then(function(xhr, response) {
      $('#spa-target').empty().html(templates['index'](response))
    })
  },
  create: function() {
    $("#spa-target").empty().alpaca({
      "schema": {
        "title": "Create Class",
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "title": "Name",
            "required": true
          },
          "dayOfTheWeek": {
            "type": "string",
            "title": "Day of the Week",
            "enum": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "default": "Monday",
            "required": true
          },
          "startTime": {
            "type": "string",
            "title": "Starting Time",
            "required": true
          },
          "endTime": {
            "type": "string",
            "title": "Ending Time",
            "required": true
          }
        }
      },
      "options": {
        "form": {
          "buttons": {
            "submit": {
              "title": "Create",
              "click": function() {
                var v = this.getValue()

                v.startTime = moment(v.startTime, "h:mm:ss a").format() 
                v.endTime = moment(v.endTime, "h:mm:ss a").format()

                qwest
                  .post("/divisions", v)
                  .then(function(xhr, response) {
                    Aviator.navigate("/admin/classes/")
                  })
              }
            },
            "back": {
              "title": "Back",
              "click": function() {
                Aviator.navigate("/admin/classes/")
              }
            }
          }
        },
        "fields": {
          "name": {
            "placeholder": "Enter a name for the class"
          },
          "dayOfTheWeek": {
            "type": "select",
            "sort": false
          },
          "startTime": {
            "type": "time"
          },
          "endTime": {
            "type": "time"
          }
        }
      },
      "view": "bootstrap-create"
    })
  },
  edit: function(request) {
    qwest.get('/divisions/' + request.namedParams.id).then(function(xhr, response) {
      $("#spa-target").empty().alpaca({
        "data": response,
        "schema": {
          "title": "Edit Class",
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "title": "Name",
              "required": true
            },
            "dayOfTheWeek": {
              "type": "string",
              "title": "Day of the Week",
              "enum": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "required": true,
              "default": "Monday"
            },
            "startTime": {
              "type": "string",
              "title": "Starting Time",
              "required": true
            },
            "endTime": {
              "type": "string",
              "title": "Ending Time",
              "required": true
            }
          }
        },
        "options": {
          "form": {
            "buttons": {
              "submit": {
                "title": "Update",
                "click": function() {
                  var v = this.getValue()

                  v.startTime = moment(v.startTime, "h:mm:ss a").format() 
                  v.endTime = moment(v.endTime, "h:mm:ss a").format()

                  qwest
                    .put("/divisions/" + request.namedParams.id, v)
                    .then(function(xhr, response) {
                      Aviator.navigate("/admin/classes/")
                    })
                }
              },
              "back": {
                "title": "Back",
                "click": function() {
                  Aviator.navigate("/admin/classes/")
                }
              }
            }
          },
          "fields": {
            "name": {
              "placeholder": "Enter a name for the class"
            },
            "dayOfTheWeek": {
              "type": "select",
              "sort": false
            },
            "startTime": {
              "type": "time"
            },
            "endTime": {
              "type": "time"
            }
          }
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
