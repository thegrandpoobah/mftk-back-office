'use strict';

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
    hooks.populate('student', {
      service: '/students',
      field: 'studentId'
    }),
    hooks.populate('division', {
      service: '/divisions',
      field: 'divisionId'
    })
  ],
  get: [
    hooks.populate('student', {
      service: '/students',
      field: 'studentId'  
    }),
    hooks.populate('division', {
      service: '/divisions',
      field: 'divisionId'
    })
  ],
  create: [],
  update: [],
  patch: [],
  remove: []
};
