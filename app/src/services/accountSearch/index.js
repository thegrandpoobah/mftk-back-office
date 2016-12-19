'use strict';

const hooks = require('./hooks');
const contact = require('../contact/contact-model');

class Service {
  constructor(options) {
    this.options = options
  }

  find(params) {
    return this.options.Model.search(params.query.q)
  }
}

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/search/accounts', new Service({
    Model: contact(app.get('sequelize'))
  }));

  // Get our initialize service to that we can bind hooks
  const accountSearchService = app.service('/api/search/accounts');

  // Set up our before hooks
  accountSearchService.before(hooks.before);

  // Set up our after hooks
  accountSearchService.after(hooks.after);
};

module.exports.Service = Service;
