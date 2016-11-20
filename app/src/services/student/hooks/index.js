'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');


exports.before = {
  all: [],
  find: [],
  get: [],
  create: [function(opts) {
    return function(hook) {
      // console.log('the hook object is AMAZING', hook.app.models.student.attributes)
      console.log('the hook object is AMAZING', hook.app.services.students.Model.attributes)
      return Promise.resolve(hook)
    }
  }()],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [
    hooks.populate('account', {
      service: '/accounts',
      field: 'accountId'  
    }
  )],
  get: [
    hooks.populate('account', {
      service: '/accounts',
      field: 'accountId'  
    }
  )],
  create: [],
  update: [],
  patch: [],
  remove: []
};
