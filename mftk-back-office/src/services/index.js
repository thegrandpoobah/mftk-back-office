'use strict';

const attendance = require('./attendance');

const division = require('./division');

const contact = require('./contact');
const account = require('./account');
const student = require('./student');
const authentication = require('./authentication');
const user = require('./user');

const path = require('path');
const fs = require('fs-extra');
const Sequelize = require('sequelize');

module.exports = function() {
  const app = this;

  fs.ensureDirSync( path.dirname(app.get('sqlite')) );
  const sequelize = new Sequelize('feathers', null, null, {
    dialect: 'sqlite',
    storage: app.get('sqlite'),
    logging: false
  });
  app.set('sequelize', sequelize);

  app.configure(authentication);
  app.configure(user);
  app.configure(student);
  app.configure(account);
  app.configure(contact);
  app.configure(division);
  app.configure(attendance);
  
  // Setup relationships
  const models = sequelize.models;
  Object.keys(models)
    .map(name => models[name])
    .filter(model => model.associate)
    .forEach(model => model.associate(models));

  sequelize.sync();

};
