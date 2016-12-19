'use strict';

const service = require('feathers-sequelize');
const attendance = require('./attendance-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: attendance(app.get('sequelize')),
    paginate: {
      default: 250,
      max: 250
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/attendances', service(options));

  // Get our initialize service to that we can bind hooks
  const attendanceService = app.service('/api/attendances');

  // Set up our before hooks
  attendanceService.before(hooks.before);

  // Set up our after hooks
  attendanceService.after(hooks.after);
};
