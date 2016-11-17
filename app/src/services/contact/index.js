'use strict';

const service = require('feathers-sequelize');
const contact = require('./contact-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: contact(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/contacts', service(options));

  // Get our initialize service to that we can bind hooks
  const contactService = app.service('/contacts');

  // Set up our before hooks
  contactService.before(hooks.before);

  // Set up our after hooks
  contactService.after(hooks.after);
};
