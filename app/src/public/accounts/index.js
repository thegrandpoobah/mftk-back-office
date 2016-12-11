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
      q = qwest

      account.contacts.forEach(function(contact, idx) {
        contact.accountId = response.id
        contact.rank = rank

        q = q.post('/contacts', contact, {dataType: 'json', responseType: 'json'})
      })

      q.then(function() {
        Aviator.navigate('/admin/accounts/')
      })
    })
}

function onUpdateClick(originalAccount, accountId) {
  var account = this.getValue()
  var q = qwest

  var processed = {}

  account.contacts.forEach(function(contact, idx) {
    contact.rank = idx
    
    if (contact.id) {
      processed[contact.id] = true
      q = q.put('/contacts/' + contact.id, contact, {dataType: 'json', responseType: 'json'})
    } else {
      contact.accountId = accountId
      q = q.post('/contacts/', contact, {dataType: 'json', responseType: 'json'})
    }
  })

  originalAccount.contacts.forEach(function(contact) {
    if (!processed[contact.id]) {
      q = q.delete('/contacts/' + contact.id, {dataType: 'json', responseType: 'json'})
    }
  })

  q = q.put('/accounts/' + accountId, {'active': account.active}, {dataType: 'json', responseType: 'json'})

  q.then(function() {
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
    qwest.get('/accounts/' + request.namedParams.id).then(function(xhr, response) {
      response.contacts.sort(function(a, b) {
        return a.rank - b.rank
      })

      $("#spa-target").empty().alpaca({
        "data": response,
        "schema": require('./edit-account-schema.json'),
        "options": {
          "fields": require('./edit-account-options.json'),
          "form": {
            "buttons": {
              "submit": {
                "title": "Update",
                "click": function() { return onUpdateClick.call(this, response, request.namedParams.id) }
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
        "view": "bootstrap-edit"
      })
    })
  },
  notes: function(request) {
  },
  delete: function(request) {
    qwest.get('/accounts/' + request.namedParams.id).then(function(xhr, response) {
      var q = qwest

      response.contacts.forEach(function(contact) {
        q = q.delete('/contacts/' + contact.id)
      })

      q
        .delete('/accounts/' + response.id)
        .then(function() {
          Aviator.navigate("/admin/accounts/")
        })
    })
  }
}
