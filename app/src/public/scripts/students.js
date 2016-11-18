var Aviator = require('aviator')
var qwest = require('qwest')
var $ = require('jquery')
require('handlebars/runtime')
require('eonasdan-bootstrap-datetimepicker')
var moment = require('moment')
require('alpaca')

var templates = {
  'index': require('../students/index.html.handlebars')
}

module.exports = {
  index: function() {
    qwest.get('/students').then(function(xhr, response) {
      $('#spa-target').empty().html(templates['index'](response))
    })
  },
  create: function() {
    $("#spa-target").empty().alpaca({
      "schema": {
        "title": "Create Student",
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string",
            "title": "First Name",
            "required": true
          },
          "lastName": {
            "type": "string",
            "title": "Last Name",
            "required": true
          },
          "active": {
            "type": "boolean",
            "required": true,
            "default": true
          },
          "rank": {
            "type": "string",
            "title": "Rank",
            "enum": [
              'White',
              'Yellow Stripe',
              'Yellow',
              'Orange Stripe',
              'Orange',
              'Green Stripe',
              'Green',
              'Purple',
              'Blue',
              'Brown',
              'Red',
              'Black Tip',
              'Poomdae',
              '1st Dan Black Belt',
              '2nd Dan Black Belt',
              '3rd Dan Black Belt',
              '4th Dan Black Belt',
              '5th Dan Black Belt',
              '6th Dan Black Belt',
              '7th Dan Black Belt',
              '8th Dan Black Belt',
              '9th Dan Black Belt'
            ],
            "default": "White",
            "required": true
          },
          "roles": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ['Student', 'Demo Team', 'Instructor']
            },
            "default": ['Student']
          },
          "dateOfBirth": {
            "type": "string",
            "title": "Date Of Birth"
          },
          "accountType": {
            "type": "string",
            "title": "Account",
            "enum": ["New Account", "Existing Account"],
            "required": true
          },
          "accountId": {
            "type": "number",
            "title": "Existing Account"
          },
          "accountObject": {
            "title": "New Account",
            "type": "object",
            "properties": {
              "active": {
                "type": "boolean",
                "default": true
              },
              "contacts": {
                "type": "array",
                "title": "Contacts",
                "minItems": 1,
                "default": [{}],
                "items": {
                  "type": "object",
                  "properties": {
                    "sameAsStudent": {
                      "type": "boolean",
                      "default": true
                    },
                    "firstName": {
                      "type": "string",
                      "title": "First Name",
                      "required": true
                    },
                    "lastName": {
                      "type": "string",
                      "title": "Last Name",
                      "required": true
                    },
                    "emails": {
                      "title": "E-mails",
                      "type": "array",
                      "default": [{}],
                      "items": {
                        "type": "string"
                      }
                    },
                    "phones": {
                      "title": "Phone Numbers",
                      "type": "array",
                      "default": [{}],
                      "items": {
                        "type": "string"
                      }
                    },
                    "addresses": {
                      "title": "Addresses",
                      "type": "array",
                      "default": [{}],
                      "items": {
                        "type": "object",
                        "properties": {
                          "address1": {
                            "title": "Address 1",
                            "type": "string"
                          },
                          "address2": {
                            "title": "Address 2",
                            "type": "string"
                          },
                          "city": {
                            "title": "City",
                            "type": "string"
                          },
                          "province": {
                            "title": "Province",
                            "type": "string"
                          },
                          "country": {
                            "title": "Country",
                            "type": "string"
                          },
                          "postalCode": {
                            "title": "Postal Code",
                            "type": "string"
                          }
                        }
                      }
                    }
                  },
                  "dependencies": {
                    "firstName": ["sameAsStudent"],
                    "lastName": ["sameAsStudent"]
                  }
                }
              }
            }
          }
        },
        "dependencies": {
          "accountId": ["accountType"],
          "accountObject": ["accountType"]
        }
      },
      "options": {
        "fields": {
          "active": {
            "rightLabel": "Active Student"
          },
          "dateOfBirth": {
            "type": "date"
          },
          "rank": {
            "type": "select",
            "sort": false
          },
          "roles": {
            "type": "checkbox",
            "label": "Roles",
            "sort": false
          },
          "accountId": {
            "dependencies": {
              "accountType": "Existing Account"
            }
          },
          "accountObject": {
            "dependencies": {
              "accountType": "New Account"
            },
            "fields": {
              "active": {
                "rightLabel": "Active Account"
              },
              "contacts": {
                "label": "Contacts",
                "actionbar": {
                  "showLabels": true,
                  "actions": [
                    {
                      "label": "Remove Contact",
                      "action": "remove"
                    },
                    {
                      "action": "up",
                      "enabled": false,
                    },
                    {
                      "action": "down",
                      "enabled": false
                    },
                    {
                      "action": "add",
                      "enabled": false
                    }
                  ]
                },
                "toolbar": {
                  "actions": [
                    {
                      "action": "add",
                      "label": "Add Contact"
                    }
                  ]
                },
                "actionbarStyle": "bottom",
                "hideToolbarWithChildren": false,
                "collapsible": true,
                "toolbarSticky": true,
                "items": {
                  "fields": {
                    "sameAsStudent": {
                      "rightLabel": "Contact name is same as Student Name"
                    },
                    "firstName": {
                      "dependencies": {
                        "sameAsStudent": false
                      }
                    },
                    "lastName": {
                      "dependencies": {
                        "sameAsStudent": false
                      }
                    },
                    "emails": {
                      "actionbar": {
                        "showLabels": true,
                        "actions": [
                          {
                            "label": "Remove E-mail Address",
                            "action": "remove"
                          },
                          {
                            "action": "up",
                            "label": "Move Up"
                          },
                          {
                            "action": "down",
                            "label": "Move Down"
                          },
                          {
                            "action": "add",
                            "enabled": false
                          }
                        ]
                      },
                      "toolbar": {
                        "actions": [
                          {
                            "action": "add",
                            "label": "Add E-Mail Address"
                          }
                        ]
                      },
                      "actionbarStyle": "bottom",
                      "hideToolbarWithChildren": false,
                      "toolbarSticky": true,
                      "items": {
                        "type": "email"
                      }
                    },
                    "phones": {
                      "actionbar": {
                        "showLabels": true,
                        "actions": [
                          {
                            "label": "Remove Phone Number",
                            "action": "remove"
                          },
                          {
                            "action": "up",
                            "label": "Move Up"
                          },
                          {
                            "action": "down",
                            "label": "Move Down"
                          },
                          {
                            "action": "add",
                            "enabled": false
                          }
                        ]
                      },
                      "toolbar": {
                        "actions": [
                          {
                            "action": "add",
                            "label": "Add Phone Number"
                          }
                        ]
                      },
                      "actionbarStyle": "bottom",
                      "hideToolbarWithChildren": false,
                      "toolbarSticky": true,
                      "items": {
                        "type": "phone"
                      }
                    },
                    "addresses": {
                      "actionbar": {
                        "showLabels": true,
                        "actions": [
                          {
                            "label": "Remove Address",
                            "action": "remove"
                          },
                          {
                            "action": "up",
                            "label": "Move Up"
                          },
                          {
                            "action": "down",
                            "label": "Move Down"
                          },
                          {
                            "action": "add",
                            "enabled": false
                          }
                        ]
                      },
                      "toolbar": {
                        "actions": [
                          {
                            "action": "add",
                            "label": "Add Address"
                          }
                        ]
                      },
                      "actionbarStyle": "bottom",
                      "hideToolbarWithChildren": false,
                      "toolbarSticky": true
                    }
                  }
                }
              }
            }
          }
        },
        "form": {
          "buttons": {
            "submit": {
              "title": "Create",
              "click": function() {
                var student = this.getValue()

                if (student.accountType === 'New Account') {
                  delete student.accountType
                  
                  qwest
                    .post("/accounts", {"active": student.accountObject.active}, {dataType: 'json', responseType: 'json'})
                    .then(function(xhr, response) {
                      student.accountId = response.id

                      student.accountObject.contacts.forEach(function(contact) {
                        contact.accountId = student.accountId

                        if (contact.sameAsStudent) {
                          contact.firstName = student.firstName
                          contact.lastName = student.lastName 
                        }

                        delete contact.sameAsStudent

                        qwest
                          .post("/contacts", contact, {dataType: 'json', responseType: 'json'})
                          .then(function(xhr, response) {
                            contact.id = response.id
                          })
                      })

                      delete student.accountObject
                    }).then(function(xhr, response) {
                      qwest
                        .post("/students", student, {dataType: 'json', responseType: 'json'})
                        .then(function(xhr, response) {
                          Aviator.navigate("/admin/students/")
                        })
                    })
                }
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
      "view": "bootstrap-create"
    })
  },
  edit: function(request) {
    qwest.get('/students/' + request.namedParams.id).then(function(xhr, response) {
      response.currentAccount = response.account.contacts[0].firstName + response.account.contacts[0].lastName
      response.changeAccount = 'Keep Current Account'

      $("#spa-target").empty().alpaca({
        "data": response,
        "schema": {
          "title": "Edit Student",
          "type": "object",
          "properties": {
            "firstName": {
              "type": "string",
              "title": "First Name",
              "required": true
            },
            "lastName": {
              "type": "string",
              "title": "Last Name",
              "required": true
            },
            "active": {
              "type": "boolean",
              "required": true,
              "default": true
            },
            "rank": {
              "type": "string",
              "title": "Rank",
              "enum": [
                'White',
                'Yellow Stripe',
                'Yellow',
                'Orange Stripe',
                'Orange',
                'Green Stripe',
                'Green',
                'Purple',
                'Blue',
                'Brown',
                'Red',
                'Black Tip',
                'Poomdae',
                '1st Dan Black Belt',
                '2nd Dan Black Belt',
                '3rd Dan Black Belt',
                '4th Dan Black Belt',
                '5th Dan Black Belt',
                '6th Dan Black Belt',
                '7th Dan Black Belt',
                '8th Dan Black Belt',
                '9th Dan Black Belt'
              ],
              "default": "White",
              "required": true
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": ['Student', 'Demo Team', 'Instructor']
              },
              "default": ['Student']
            },
            "dateOfBirth": {
              "type": "string",
              "title": "Date Of Birth"
            },
            "currentAccount": {
              "type": "string",
              "title": "Current Account"
            },
            "changeAccount": {
              "type": "string",
              "title": "Change Account?",
              "enum": ["Keep Current Account", "Existing Account", "New Account"],
              "default": "Keep Current Account",
              "required": true
            },
            "accountId": {
              "type": "number",
              "title": "Account"
            },
            "accountObject": {
              "title": "New Account",
              "type": "object",
              "properties": {
                "active": {
                  "type": "boolean",
                  "default": true
                },
                "contacts": {
                  "type": "array",
                  "title": "Contacts",
                  "minItems": 1,
                  "default": [{}],
                  "items": {
                    "type": "object",
                    "properties": {
                      "sameAsStudent": {
                        "type": "boolean",
                        "default": true
                      },
                      "firstName": {
                        "type": "string",
                        "title": "First Name",
                        "required": true
                      },
                      "lastName": {
                        "type": "string",
                        "title": "Last Name",
                        "required": true
                      },
                      "emails": {
                        "title": "E-mails",
                        "type": "array",
                        "default": [{}],
                        "items": {
                          "type": "string"
                        }
                      },
                      "phones": {
                        "title": "Phone Numbers",
                        "type": "array",
                        "default": [{}],
                        "items": {
                          "type": "string"
                        }
                      },
                      "addresses": {
                        "title": "Addresses",
                        "type": "array",
                        "default": [{}],
                        "items": {
                          "type": "object",
                          "properties": {
                            "address1": {
                              "title": "Address 1",
                              "type": "string"
                            },
                            "address2": {
                              "title": "Address 2",
                              "type": "string"
                            },
                            "city": {
                              "title": "City",
                              "type": "string"
                            },
                            "province": {
                              "title": "Province",
                              "type": "string"
                            },
                            "country": {
                              "title": "Country",
                              "type": "string"
                            },
                            "postalCode": {
                              "title": "Postal Code",
                              "type": "string"
                            }
                          }
                        }
                      }
                    },
                    "dependencies": {
                      "firstName": ["sameAsStudent"],
                      "lastName": ["sameAsStudent"]
                    }
                  }
                }
              }
            }
          },
          "dependencies": {
            "accountId": ["changeAccount"],
            "accountObject": ["changeAccount"]
          }
        },
        "options": {
          "fields": {
            "active": {
              "rightLabel": "Active Student"
            },
            "dateOfBirth": {
              "type": "date"
            },
            "rank": {
              "type": "select",
              "sort": false
            },
            "roles": {
              "type": "checkbox",
              "label": "Roles",
              "sort": false
            },
            "currentAccount": {
              "readonly": true
            },
            "changeAccount": { 
              "sort": false
            },
            "accountId": {
              "dependencies": {
                "changeAccount": "Existing Account"
              }
            },
            "accountObject": {
              "dependencies": {
                "changeAccount": "New Account"
              },
              "fields": {
                "active": {
                  "rightLabel": "Active Account"
                },
                "contacts": {
                  "label": "Contacts",
                  "actionbar": {
                    "showLabels": true,
                    "actions": [
                      {
                        "label": "Remove Contact",
                        "action": "remove"
                      },
                      {
                        "action": "up",
                        "enabled": false,
                      },
                      {
                        "action": "down",
                        "enabled": false
                      },
                      {
                        "action": "add",
                        "enabled": false
                      }
                    ]
                  },
                  "toolbar": {
                    "actions": [
                      {
                        "action": "add",
                        "label": "Add Contact"
                      }
                    ]
                  },
                  "actionbarStyle": "bottom",
                  "hideToolbarWithChildren": false,
                  "collapsible": true,
                  "toolbarSticky": true,
                  "items": {
                    "fields": {
                      "sameAsStudent": {
                        "rightLabel": "Contact name is same as Student Name"
                      },
                      "firstName": {
                        "dependencies": {
                          "sameAsStudent": false
                        }
                      },
                      "lastName": {
                        "dependencies": {
                          "sameAsStudent": false
                        }
                      },
                      "emails": {
                        "actionbar": {
                          "showLabels": true,
                          "actions": [
                            {
                              "label": "Remove E-mail Address",
                              "action": "remove"
                            },
                            {
                              "action": "up",
                              "label": "Move Up"
                            },
                            {
                              "action": "down",
                              "label": "Move Down"
                            },
                            {
                              "action": "add",
                              "enabled": false
                            }
                          ]
                        },
                        "toolbar": {
                          "actions": [
                            {
                              "action": "add",
                              "label": "Add E-Mail Address"
                            }
                          ]
                        },
                        "actionbarStyle": "bottom",
                        "hideToolbarWithChildren": false,
                        "toolbarSticky": true,
                        "items": {
                          "type": "email"
                        }
                      },
                      "phones": {
                        "actionbar": {
                          "showLabels": true,
                          "actions": [
                            {
                              "label": "Remove Phone Number",
                              "action": "remove"
                            },
                            {
                              "action": "up",
                              "label": "Move Up"
                            },
                            {
                              "action": "down",
                              "label": "Move Down"
                            },
                            {
                              "action": "add",
                              "enabled": false
                            }
                          ]
                        },
                        "toolbar": {
                          "actions": [
                            {
                              "action": "add",
                              "label": "Add Phone Number"
                            }
                          ]
                        },
                        "actionbarStyle": "bottom",
                        "hideToolbarWithChildren": false,
                        "toolbarSticky": true,
                        "items": {
                          "type": "phone"
                        }
                      },
                      "addresses": {
                        "actionbar": {
                          "showLabels": true,
                          "actions": [
                            {
                              "label": "Remove Address",
                              "action": "remove"
                            },
                            {
                              "action": "up",
                              "label": "Move Up"
                            },
                            {
                              "action": "down",
                              "label": "Move Down"
                            },
                            {
                              "action": "add",
                              "enabled": false
                            }
                          ]
                        },
                        "toolbar": {
                          "actions": [
                            {
                              "action": "add",
                              "label": "Add Address"
                            }
                          ]
                        },
                        "actionbarStyle": "bottom",
                        "hideToolbarWithChildren": false,
                        "toolbarSticky": true
                      }
                    }
                  }
                }
              }
            }
          },
          "form": {
            "buttons": {
              "submit": {
                "title": "Update",
                "click": function() {
                  var student = this.getValue()

                  console.log(student)
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
        "view": "bootstrap-edit"
      })
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
