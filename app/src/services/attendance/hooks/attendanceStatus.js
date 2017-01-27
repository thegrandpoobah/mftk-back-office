'use strict';

const moment = require('moment-timezone')

// src/services/attendance/hooks/singleAttendance.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {
  early_threshold: -3,
  late_threshold: 2
};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook, next) {
    if (hook.data.status) {
      next()
      
      return
    }

    hook.app.service('/api/divisions')
      .get(hook.data.divisionId)
      .then(function(result) {
        const signInTime = moment.tz(hook.data.signInTime, result.timezone)
        const signInTimeMinutes = signInTime.diff(signInTime.clone().startOf('day'), 'minutes')

        const delta = signInTimeMinutes - result.startTime

        if (delta < options.early_threshold) {
          hook.data.status = 'Early'
        } else if (delta >= options.early_threshold && delta <= options.late_threshold) {
          hook.data.status = 'On Time'
        } else if (delta > options.late_threshold) {
          hook.data.status = 'Late'
        }

        next()
      })
  };
};
