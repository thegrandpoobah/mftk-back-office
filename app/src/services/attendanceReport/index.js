'use strict';

const hooks = require('./hooks');
const attendance = require('../attendance/attendance-model');
const student = require('../student/student-model');
const moment = require('moment-timezone')

class Service {
  constructor(options) {
    this.options = options
  }

  find(params) {
    const startTime = moment(params.query.startTime)
    const endTime = moment(params.query.endTime)

    // params.query...
    return this.options.app.services['api/students'].Model.findAll({
      where: {
        'active': true
      },
      attributes: ['id', 'firstName', 'lastName'],
      include: [
        {
          model: this.options.app.services['api/attendances'].Model,
          as: 'attendance',
          attributes: ['signInTime', 'status', 'divisionId'],
          required: false,
          where: {
            $or: [
              {
                'signInTime': {
                  $gte: startTime,
                  $lte: endTime, 
                },
              },
              {
                'signInTime': null
              }
            ]
          }
        }
      ],
      order: [
        ['firstName'],
        ['lastName'],
        [
          {
            model: this.options.app.services['api/attendances'].Model,
            as: 'attendance',
          },
          'signInTime'
        ]
      ]
    })
  }
}

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/attendanceReports', new Service({
    app: app
  }));

  // Get our initialize service to that we can bind hooks
  const attendanceReportService = app.service('/api/attendanceReports');

  // Set up our before hooks
  attendanceReportService.before(hooks.before);

  // Set up our after hooks
  attendanceReportService.after(hooks.after);
};

module.exports.Service = Service;
