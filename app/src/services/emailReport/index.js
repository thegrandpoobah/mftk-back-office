'use strict';

const hooks = require('./hooks');
const account = require('../account/account-model');

class Service {
  constructor(options) {
    this.options = options
  }

  find (params) {
    // params.query...
    return this.options.app.services['api/accounts']
      .find({ where: { active: true } })
      .then((accts) => {
        const accum = []

        // console.log(accts)

        accts.data.forEach((acct) => {
          acct.contacts.forEach((contact) => {
            contact.emails.forEach((email) => {
              accum.push({
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: email
              })
            })
          })
        })

        return accum
      })
  }
}

module.exports = function () {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/emailReport', new Service({
    app: app
  }));

  // Get our initialize service to that we can bind hooks
  const emailReportService = app.service('/api/emailReport');

  // Set up our before hooks
  emailReportService.before(hooks.before);

  // Set up our after hooks
  emailReportService.after(hooks.after);
};

module.exports.Service = Service;
