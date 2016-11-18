'use strict';

const hooks = require('./hooks');
const student = require('../student/student-model');

class Service {
  constructor(options) {
    this.options = options
  }

  find(params) {
    return this.options.Model.search(params.query.role, params.query.q)
  }
}

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/search/students', new Service({
    Model: student(app.get('sequelize'))
  }));

  // Get our initialize service to that we can bind hooks
  const studentSearchService = app.service('/search/students');

  // Set up our before hooks
  studentSearchService.before(hooks.before);

  // Set up our after hooks
  studentSearchService.after(hooks.after);
};

module.exports.Service = Service;
