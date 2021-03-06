'use strict';

const service = require('feathers-sequelize');
const note = require('./note-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: note(app.get('sequelize')),
    paginate: {
      default: 250,
      max: 250
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/notes', service(options));

  // Get our initialize service to that we can bind hooks
  const noteService = app.service('/api/notes');

  // Set up our before hooks
  noteService.before(hooks.before);

  // Set up our after hooks
  noteService.after(hooks.after);
};
