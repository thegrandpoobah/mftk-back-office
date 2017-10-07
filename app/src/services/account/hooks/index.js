'use strict';

const deactiveStudents = require('./deactiveStudents');

const populateContacts = require('./populateContacts');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');


exports.before = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [populateContacts()],
  get: [populateContacts()],
  create: [],
  update: [deactiveStudents()],
  patch: [deactiveStudents()],
  remove: []
};
