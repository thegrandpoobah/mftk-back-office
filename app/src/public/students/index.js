var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
var Handlebars = require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
require('alpaca')

qwest.setDefaultDataType('json')

var TIME_FORMAT = 'h:mma'

Handlebars.registerHelper({
  'date': function (date, opts) {
    return moment(date).format(opts.hash.format)
  },
  'time': function (t) {
    return moment().startOf('day').add(t, 'minutes').format(TIME_FORMAT)
  },
  'age': function (d) {
    return moment(d).toNow(true) + ' old'
  }
})

var templates = {
  'index': require('./index.html.handlebars'),
  'notes': require('./notes.html.handlebars'),
  'attendance': require('./attendance.html.handlebars')
}

function createAccount(student, account) {
  return qwest
    .post('/api/accounts/', {'active': account.active})
    .then(function(xhr, response) {
      account.contacts.forEach(function(contact, idx) {
        contact.accountId = response.id
        contact.rank = idx

        if (contact.sameAsStudent) {
          contact.firstName = student.firstName
          contact.lastName = student.lastName
          contact.gender = student.gender
        }

        delete contact.sameAsStudent

        qwest.post('/api/contacts', contact)
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
        .post('/api/students', student)
        .then(function(xhr, response) {
          Aviator.navigate('/admin/students/')
        })
    })
  } else {
    delete student.accountType

    qwest
      .post('/api/students', student)
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
        .put('/api/students/' + studentId, student)
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
    .put('/api/students/' + studentId, student)
    .then(function(xhr, response) {
      Aviator.navigate('/admin/students/')
    })
}

function prepareExistingAccountDropDown(ctrl) {
  ctrl.control.css({width: '100%'}).select2({
    placeholder: 'Select an Account',
    theme: "bootstrap",
    ajax: {
      url: "/api/search/accounts",
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          q: params.term // search term
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
              id: item.accountId,
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
  });
}

function responseToModel(response) {
  response.dateOfBirth = moment(response.dateOfBirth.split('T')[0])

  return response
}

module.exports = {
  index: function() {
    qwest.get('/api/students?$sort[firstName]=1&$sort[lastName]=1').then(function(xhr, response) {
      if (response.data) {
        response.data = response.data.map(responseToModel)
      }

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
      "view": "bootstrap-create",
      "postRender": function(control) {
        prepareExistingAccountDropDown(control.childrenByPropertyId["accountId"])
      }
    })
  },
  edit: function(request) {
    qwest.get('/api/students/' + request.namedParams.id).then(function(xhr, response) {
      response = responseToModel(response)

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
        "view": "bootstrap-edit",
        "postRender": function(control) {
          control.childrenByPropertyId["accountId"].control
            .empty()
            .append('<option value="' + response.account.id + '">' + response.currentAccount + '</option>')
          
          prepareExistingAccountDropDown(control.childrenByPropertyId["accountId"])
        }
      })
    })
  },
  attendance: function(request) {
    qwest
      .get('/api/students/' + request.namedParams.id)
      .get('/api/attendances?$sort[createdAt]=-1&studentId=' + request.namedParams.id)
      .then(function(responses) {
        $("#spa-target").empty().html(templates['attendance']({
          student: responses[0][1],
          attendance: responses[1][1].data
        }))
      })
  },
  notes: function(request) {
    qwest
      .get('/api/students/' + request.namedParams.id)
      .get('/api/notes?$sort[createdAt]=-1&studentId=' + request.namedParams.id)
      .then(function(responses) {
        $("#spa-target").empty().html(templates['notes']({
          student: responses[0][1],
          notes: responses[1][1].data
        }))
      })
  },
  delete: function(request) {
    qwest
      .delete("/api/students/" + request.namedParams.id)
      .then(function(xhr, response) {
        Aviator.navigate("/admin/students/")
      })
  }
}
