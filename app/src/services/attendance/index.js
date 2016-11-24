'use strict';

const service = require('feathers-sequelize');
const attendance = require('./attendance-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: attendance(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/attendances', service(options));

  // Get our initialize service to that we can bind hooks
  const attendanceService = app.service('/attendances');

  // Set up our before hooks
  attendanceService.before(hooks.before);

  // Set up our after hooks
  attendanceService.after(hooks.after);
};
