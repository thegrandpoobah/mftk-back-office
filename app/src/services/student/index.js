'use strict';

const service = require('feathers-sequelize');
const student = require('./student-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: student(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/students', service(options));

  // Get our initialize service to that we can bind hooks
  const studentService = app.service('/students');

  // Set up our before hooks
  studentService.before(hooks.before);

  // Set up our after hooks
  studentService.after(hooks.after);
};
