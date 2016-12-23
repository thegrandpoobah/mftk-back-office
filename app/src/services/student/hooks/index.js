'use strict';

const populateRanks = require('./populateRanks');

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
  find: [
    populateRanks(),
    hooks.populate('account', {
      service: '/api/accounts',
      field: 'accountId'
    })
  ],
  get: [
    populateRanks(),
    hooks.populate('account', {
      service: '/api/accounts',
      field: 'accountId'  
    })
  ],
  create: [],
  update: [],
  patch: [],
  remove: []
};
