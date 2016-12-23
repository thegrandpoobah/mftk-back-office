'use strict';

const service = require('feathers-sequelize');
const rank = require('./rank-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: rank(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/ranks', service(options));

  // Get our initialize service to that we can bind hooks
  const rankService = app.service('/api/ranks');

  // Set up our before hooks
  rankService.before(hooks.before);

  // Set up our after hooks
  rankService.after(hooks.after);
};
