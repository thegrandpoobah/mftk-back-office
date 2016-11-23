var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
var Handlebars = require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
require('alpaca')

Handlebars.registerHelper({
  'date': function (date, opts) {
    return moment(date).format(opts.hash.format)
  }
})

var templates = {
  'index': require('./index.html.handlebars'),
  'notes': require('./notes.html.handlebars'),
  'attendance': require('./attendance.html.handlebars')
}

function createAccount(student, account) {
  return qwest
    .post('/accounts/', {'active': account.active}, {dataType: 'json', responseType: 'json'})
    .then(function(xhr, response) {
      account.contacts.forEach(function(contact) {
        contact.accountId = response.id

        if (contact.sameAsStudent) {
          contact.firstName = student.firstName
          contact.lastName = student.lastName
          contact.gender = student.gender
        }

        delete contact.sameAsStudent

        qwest.post('/contacts', contact, {dataType: 'json', responseType: 'json'})
      })

      return response.id
    })
}

function onCreateClick() {
  var student = this.getValue()

  if (student.accountType === 'New Account') {
    delete student.accountType
    
    createAccount(student, student.accountObject).then(function(accountId) {
      student.accountId = accountId

      delete student.accountObject

      qwest
        .post('/students', student, {dataType: 'json', responseType: 'json'})
        .then(function(xhr, response) {
          Aviator.navigate('/admin/students/')
        })
    })
  } else {
    delete student.accountType

    qwest
      .post('/students', student, {dataType: 'json', responseType: 'json'})
      .then(function(xhr, response) {
        Aviator.navigate('/admin/students/')
      })
  }
}

function onUpdateClick(originalStudent, studentId) {
  var student = this.getValue()

  var changeAccount = student.changeAccount

  delete student.currentAccount
  delete student.changeAccount

  switch (changeAccount) {
  case 'New Account':
    createAccount(student, student.accountObject).then(function(accountId) {
      student.accountId = accountId

      delete student.accountObject

      qwest
        .put('/students/' + studentId, student, {dataType: 'json', responseType: 'json'})
        .then(function(xhr, response) {
          Aviator.navigate('/admin/students/')
        })
    })

    return
  case 'Keep Current Account':
    student.accountId = originalStudent.account.id
    break
  }

  qwest
    .put('/students/' + studentId, student, {dataType: 'json', responseType: 'json'})
    .then(function(xhr, response) {
      Aviator.navigate('/admin/students/')
    })
}

module.exports = {
  index: function() {
    qwest.get('/students?$sort[firstName]=1&$sort[lastName]=1').then(function(xhr, response) {
      $('#spa-target').empty().html(templates['index'](response))
    })
  },
  create: function() {
    $("#spa-target").empty().alpaca({
      "schema": require('./new-student-schema.json'),
      "options": {
        "fields": require('./new-student-options.json'),
        "form": {
          "buttons": {
            "submit": {
              "title": "Create",
              "click": onCreateClick
            },
            "back": {
              "title": "Back",
              "click": function() {
                Aviator.navigate("/admin/students/")
              }
            }
          }
        },
      },
      "view": "bootstrap-create"
    })
  },
  edit: function(request) {
    qwest.get('/students/' + request.namedParams.id).then(function(xhr, response) {
      response.currentAccount = [response.account.contacts[0].firstName, response.account.contacts[0].lastName].join(' ')
      response.changeAccount = 'Keep Current Account'
      response.dateOfBirth = moment(response.dateOfBirth).format('MM/DD/YYYY')

      $("#spa-target").empty().alpaca({
        "data": response,
        "schema": require('./edit-student-schema.json'),
        "options": {
          "fields": require('./edit-student-options.json'),
          "form": {
            "buttons": {
              "submit": {
                "title": "Update",
                "click": function() { return onUpdateClick.call(this, response, request.namedParams.id) }
              },
              "back": {
                "title": "Back",
                "click": function() {
                  Aviator.navigate("/admin/students/")
                }
              }
            }
          },
        },
        "view": "bootstrap-edit"
      })
    })
  },
  attendance: function(request) {
    qwest.get('/attendances?studentId=' + request.namedParams.id).then(function(xhr, response) {
      $("#spa-target").empty().html(templates['attendance'](response))
    })
  },
  notes: function(request) {
    qwest.get('/notes?$sort[createdAt]=-1&studentId=' + request.namedParams.id).then(function(xhr, response) {
      $("#spa-target").empty().html(templates['notes'](response.data, {foo: function() { return 'HIIII' }}))
    })
  },
  delete: function(request) {
    qwest
      .delete("/students/" + request.namedParams.id)
      .then(function(xhr, response) {
        Aviator.navigate("/admin/students/")
      })
  }
}
