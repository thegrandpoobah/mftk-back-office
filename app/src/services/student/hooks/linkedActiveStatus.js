const _ = require('lodash')

'use strict';


// src/services/student/hooks/linkedActiveStatus.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    return hook.result.getAccount().then(account => {
      return hook.app
        .service('/api/students')
        .find({
          query: {
            accountId: hook.result.accountId
          }
        }).then(students => {
          return account
            .update({ active: !_.every(students.data, { 'active': false }) })
            .then(() => hook)
        })
    })
    hook.linkedActiveStatus = true;
  };
};
