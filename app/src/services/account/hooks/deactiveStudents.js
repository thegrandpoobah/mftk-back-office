'use strict';

// src/services/account/hooks/deactiveStudents.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    if (!hook.result.active) {
      return hook.app
        .service('/api/students').Model
        .update({ active: false }, { where: { accountId: hook.result.id } })
        .then(() => hook)
    }
    hook.deactiveStudents = true;
  };
};
