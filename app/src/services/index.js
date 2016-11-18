'use strict';

const curriculumLog = require('./curriculumLog');
const note = require('./note');
const attendance = require('./attendance');
const division = require('./division');
const contact = require('./contact');
const account = require('./account');
const student = require('./student');
const studentSearch = require('./studentSearch');
const authentication = require('./authentication');
const user = require('./user');

const path = require('path');
const fs = require('fs-extra');
const Sequelize = require('sequelize');

module.exports = function() {
  const app = this;


  const sequelize = new Sequelize(app.get('postgres'), {
    dialect: 'postgres',
    logging: console.log
  });
  app.set('sequelize', sequelize);

  app.configure(authentication);
  app.configure(user);
  app.configure(student);
  app.configure(studentSearch);
  app.configure(account);
  app.configure(contact);
  app.configure(division);
  app.configure(attendance);
  app.configure(note);
  app.configure(curriculumLog);

  // Setup relationships
  const models = sequelize.models;
  Object.keys(models)
    .map(name => models[name])
    .filter(model => model.associate)
    .forEach(model => model.associate(models));

  sequelize.sync().done(function() {
    models.student.addFullTextIndex();
  })
};
