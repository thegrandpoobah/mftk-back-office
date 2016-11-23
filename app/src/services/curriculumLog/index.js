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

  const srv = service(options);

  const currentFind = srv._find
  srv._find = function(params, getFilter) {
    if (params.query.type) {
      const searchType = params.query.type

      delete params.query.type

      return currentFind.call({Model:{
        findAndCount(q) {
          q.include = [{
            model: app.service('/divisions').Model,
            as: 'division',
            required: true
          }]

          // not sure if this is the right way of doing this
          // but it works.
          q.where = srv.Model.sequelize.and(
            { '$division.types$': srv.Model.sequelize.literal("division.types @> array['"+searchType+"']::varchar[]") },
            q.where)
          
          return srv.Model.findAndCount(q)
        }
      }}, params, getFilter)
    } else {
      return currentFind.call(this, params, getFilter)
    }
  }

  // Initialize our service with any options it requires
  app.use('/curriculumLogs', srv);

  // Get our initialize service to that we can bind hooks
  const curriculumLogService = app.service('/curriculumLogs');

  // Set up our before hooks
  curriculumLogService.before(hooks.before);

  // Set up our after hooks
  curriculumLogService.after(hooks.after);
};
