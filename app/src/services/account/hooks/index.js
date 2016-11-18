'use strict';

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
  update: [],
  patch: [],
  remove: []
};
