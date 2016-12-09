var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
require('alpaca')

var templates = {
  'index': require('./index.html.handlebars')
}

function onCreateClick() {
  var account = this.getValue()

  return qwest
    .post('/accounts/', {'active': account.active}, {dataType: 'json', responseType: 'json'})
    .then(function(xhr, response) {
      account.contacts.forEach(function(contact) {
        contact.accountId = response.id

        qwest.post('/contacts', contact, {dataType: 'json', responseType: 'json'})
      })

      Aviator.navigate('/admin/accounts/')
    })
}

module.exports = {
  index: function() {
    qwest.get('/accounts').then(function(xhr, response) {
      $('#spa-target').empty().html(templates['index'](response))
    })
  },
  create: function() {
    $("#spa-target").empty().alpaca({
      "schema": require('./new-account-schema.json'),
      "options": {
        "fields": require('./new-account-options.json'),
        "form": {
          "buttons": {
            "submit": {
              "title": "Create",
              "click": onCreateClick
            },
            "back": {
              "title": "Back",
              "click": function() {
                Aviator.navigate("/admin/accounts/")
              }
            }
          }
        },
      },
      "view": "bootstrap-create"
    })
  },
  edit: function(request) {
  },
  notes: function(request) {
  },
  delete: function(request) {
  }
}
