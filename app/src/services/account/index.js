'use strict';

const service = require('feathers-sequelize');
const account = require('./account-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: account(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/accounts', service(options));

  // Get our initialize service to that we can bind hooks
  const accountService = app.service('/accounts');

  // Set up our before hooks
  accountService.before(hooks.before);

  // Set up our after hooks
  accountService.after(hooks.after);
};
