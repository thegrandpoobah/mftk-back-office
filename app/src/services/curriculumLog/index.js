'use strict';

const service = require('feathers-sequelize');
const curriculumLog = require('./curriculumLog-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: curriculumLog(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/curriculumLogs', service(options));

  // Get our initialize service to that we can bind hooks
  const curriculumLogService = app.service('/curriculumLogs');

  // Set up our before hooks
  curriculumLogService.before(hooks.before);

  // Set up our after hooks
  curriculumLogService.after(hooks.after);
};
