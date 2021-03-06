'use strict';

const singleAttendance = require('./singleAttendance');
const attendanceStatus = require('./attendanceStatus');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');


exports.before = {
  all: [],
  find: [],
  get: [],
  create: [attendanceStatus(), singleAttendance()],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [
    hooks.populate('student', {
      service: '/api/students',
      field: 'studentId'
    }),
    hooks.populate('division', {
      service: '/api/divisions',
      field: 'divisionId'
    })
  ],
  get: [
    hooks.populate('student', {
      service: '/api/students',
      field: 'studentId'  
    }),
    hooks.populate('division', {
      service: '/api/divisions',
      field: 'divisionId'
    })
  ],
  create: [],
  update: [],
  patch: [],
  remove: []
};
