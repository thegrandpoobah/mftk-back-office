'use strict';

const moment = require('moment')

// src/services/attendance/hooks/singleAttendance.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook, next) {
  	hook.app.service('/api/attendances').find({
  		query: {
	  		studentId: hook.data.studentId,
	  		divisionId: hook.data.divisionId,
	  		signInTime: {
	  			$gte: moment().startOf('day'), 
	  			$lte: moment().endOf('day')
	  		}
	  	}
  	}).then(function(result) {
  		console.log(result)

  		if (result.total >= 1) {
  			hook.result = result.data[0]
  		}

		next()
  	})
  };
};
