var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
var _ = require('lodash')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
var title = require('../title')
require('alpaca')
require('fullcalendar')

qwest.setDefaultDataType('json')

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
          qwest
            .post('/api/ranks', {
              rank: 'White',
              promotedOn: moment(),
              studentId: response.id 
            })
            .then(function() {
              Aviator.navigate('/admin/students/')
            })
        })
    })
  } else {
    delete student.accountType

    qwest
      .post('/api/students', student)
      .then(function(xhr, response) {
        qwest
          .post('/api/ranks', {
            rank: 'White',
            promotedOn: moment(),
            studentId: response.id 
          })
          .then(function() {
            Aviator.navigate('/admin/students/')
          })
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

function onUpdatePromotionHistoryClick(originalRanks, studentId) {
  var ranks = this.getValue()
  var visitedRanks = {}

  var q = qwest

  ranks.forEach(function(rank) {
    if (rank.id) {
      visitedRanks[rank.id] = true

      q = q.put('/api/ranks/' + rank.id, rank)
    } else {
      rank.studentId = studentId
      q = q.post('/api/ranks/', rank)
    }
  })

  originalRanks.forEach(function(rank) {
    if (visitedRanks[rank.id]) {
      return
    }

    q = q.delete('/api/ranks/' + rank.id)
  })

  q.then(function() {
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
    title.set('Students')

    qwest.get('/api/students?$sort[firstName]=1&$sort[lastName]=1').then(function(xhr, response) {
      if (response.data) {
        response.data = response.data.map(responseToModel)
      }

      $('#spa-target').empty().html(templates['index'](response))
    })
  },
  create: function() {
    title.set('New Student')

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
      title.set('Edit Student ' + [response.firstName, response.lastName].join(' '))

      response = responseToModel(response)

      if (response.account) {
        response.currentAccount = [response.account.contacts[0].firstName, response.account.contacts[0].lastName].join(' ')
        response.changeAccount = 'Keep Current Account'
      } else {
        response.changeAccount = 'New Account'
      }

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
                "click": function() {
                  return onUpdateClick.call(this, response, request.namedParams.id)
                }
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
          if (response.account) {
            control.childrenByPropertyId["accountId"].control
              .empty()
              .append('<option value="' + response.account.id + '">' + response.currentAccount + '</option>')
          }

          prepareExistingAccountDropDown(control.childrenByPropertyId["accountId"])
        }
      })
    })
  },
  attendance: function(request) {
    qwest
      .get('/api/students/' + request.namedParams.id)
      .then(function(xhr, response) {
        title.set('Attendance for ' + [response.firstName, response.lastName].join(' '))

        $("#spa-target").empty().html(templates['attendance'](response))

        let defaultDate = moment()
        if (request.queryParams.month) {
          defaultDate = moment(request.queryParams.month, 'MMYYYY')
        }

        $('#calendar').fullCalendar({
          defaultDate: defaultDate,
          events: function(start, end, timezone, callback) {
            qwest
              .get('/api/attendances?$sort[createdAt]=-1&studentId=' + request.namedParams.id + '&signInTime[$gte]=' + start.format() + '&signInTime[$lte]=' + end.format())
              .then(function(xhr, response) {
                var events = response.data.map(function(event) {
                  var colour = '#777'
                  switch (event.status) {
                    case 'Early':
                      colour = '#5CB85C'
                      break
                    case 'On Time':
                      colour = '#F0AD4E'
                      break
                    case 'Late':
                      colour = '#D9534F'
                      break
                  }

                  return {
                    title: event.division.name,
                    start: moment(event.signInTime),
                    backgroundColor: colour,
                    borderColor: colour,
                    textColor: 'white'
                  }
                })

                callback(events)
              })

            Aviator.navigate('/admin/students/' + request.namedParams.id + '/attendance/', {
              queryParams: {
                month: $('#calendar').fullCalendar('getDate').format('MMYYYY'),
              },
              silent: true
            })
          }
        })
      })
  },
  notes: function(request) {
    qwest
      .get('/api/students/' + request.namedParams.id)
      .get('/api/notes?$sort[createdAt]=-1&studentId=' + request.namedParams.id)
      .then(function(responses) {
        title.set('Disciplinary Notes for ' + [responses[0][1].firstName, responses[0][1].lastName].join(' '))

        $("#spa-target").empty().html(templates['notes']({
          student: responses[0][1],
          notes: responses[1][1].data
        }))
      })
  },
  ranks: function(request) {
    qwest
      .get('/api/students/' + request.namedParams.id)
      .then(function(xhr, response) {
        title.set('Rank Promotions for ' + [response.firstName, response.lastName].join(' '))
        
        response.ranks.forEach(function(rank) {
          rank.promotedOn = moment(rank.promotedOn.split('T')[0])
        })

        $("#spa-target").empty().alpaca({
          "data": response.ranks,
          "schema": require('./ranks-schema.json'),
          "options": _.merge({}, require('./ranks-options.json'), {
            "toolbar": {
              "actions": [
                {
                  "action": "add",
                  "label": "Add Promotion",
                  "click": function(key, action) {
                    // i found this by looking through Alpaca's code
                    // pretty sure that I am breaking encapsulation, but
                    // whatever
                    var self = this

                    this.handleActionBarAddItemClick(0, function(item) {
                      self.handleActionBarMoveItemDownClick(0, function(item) {
                      })
                    })
                  }
                }
              ]
            },
            "form": {
              "buttons": {
                "submit": {
                  "title": "Update",
                  "click": function() { 
                    return onUpdatePromotionHistoryClick.call(this, response.ranks, request.namedParams.id)
                  }
                },
                "back": {
                  "title": "Back",
                  "click": function() {
                    Aviator.navigate("/admin/students/")
                  }
                }
              }
            }
          }),
          "view": "bootstrap-edit",
          "postRender": function(control) {
            $(".rank-table .table-responsive").removeClass("table-responsive")
          }
        })
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
