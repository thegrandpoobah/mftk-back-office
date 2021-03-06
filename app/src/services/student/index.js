'use strict';

const service = require('feathers-sequelize');
const student = require('./student-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: student(app.get('sequelize')),
    paginate: {
      default: 250,
      max: 250
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/students', service(options));

  // Get our initialize service to that we can bind hooks
  const studentService = app.service('/api/students');

  // Set up our before hooks
  studentService.before(hooks.before);

  // Set up our after hooks
  studentService.after(hooks.after);
};
