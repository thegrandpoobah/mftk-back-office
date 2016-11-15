var qwest = require('qwest')

var templates = {
  'classes-index-template': require('../classes/index.html.handlebars')
}

module.exports = {
  index: function() {
    qwest.get('/divisions').then(function(xhr, response) {
      $('#spa-target').empty().html(templates['classes-index-template'](response))
    })
  },
  edit: function(request) {
    $("#spa-target").empty().alpaca({
      "schema": {
        "title": "Edit Class",
        "description": "What do you think about Alpaca?",
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
                console.log('Submitting Form')
              }
            }
          }
        },
        // "helper": "Tell us what you think about Alpaca!",
        "fields": {
          "name": {
            // "helper": "Please enter your name.",
            "placeholder": "Enter a name for the class"
          },
          "dayOfTheWeek": {
            "type": "select"
            // "helper": "Select your ranking.",
            // "optionLabels": ["Awesome!", "It's Ok", "Hmm..."]
          },
          "startTime": {
            "type": "time"
          },
          "endTime": {
            "type": "time"
          }
        }
      }
    })

    // console.log('edit divisions', request.namedParams)
  },
  delete: function(request) {
    console.log('delete divisions', request.namedParams)
  }
}
