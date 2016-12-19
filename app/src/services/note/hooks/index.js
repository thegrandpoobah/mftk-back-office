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
    hooks.populate('instructor', {
      service: '/api/students',
      field: 'instructorId'  
    }),
    hooks.populate('student', {
      service: '/api/students',
      field: 'studentId'  
    })
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
