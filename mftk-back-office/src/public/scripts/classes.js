var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
// require('moment')
require('alpaca')

var templates = {
  'classes-index': require('../classes/index.html.handlebars')
}

module.exports = {
  index: function() {
    qwest.get('/divisions').then(function(xhr, response) {
      $('#spa-target').empty().html(templates['classes-index'](response))
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
            "enum": ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
          "attributes": {
            "action": "/divisions",
            "method": "post"
          },
          "buttons": {
            "submit": {
              "title": "Create",
              "click": function() {
                console.log('Submitting Form', this.getValue())

                Aviator.navigate("/admin/classes/")
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
            "type": "select"
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
              "enum": ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
            "attributes": {
              "action": "/divisions/" + request.namedParams.id,
              "method": "put"
            },
            "buttons": {
              "submit": {
                "title": "Update",
                "click": function() {
                  console.log('Submitting Form', this.getValue())

                  Aviator.navigate("/admin/classes/")
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
              "type": "select"
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
    console.log('delete divisions', request.namedParams)
  }
}
