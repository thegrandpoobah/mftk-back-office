'use strict';

const service = require('feathers-sequelize');
const division = require('./division-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: division(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/divisions', service(options));

  // Get our initialize service to that we can bind hooks
  const divisionService = app.service('/divisions');

  // Set up our before hooks
  divisionService.before(hooks.before);

  // Set up our after hooks
  divisionService.after(hooks.after);
};
