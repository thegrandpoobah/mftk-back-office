'use strict';

// contact-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const contact = sequelize.define('contact', {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    emails: {
      // type: Sequelize.ARRAY(Sequelize.STRING)
      type: Sequelize.STRING // TODO: use postgreql instead
    },
    phones: {
      // type: Sequelize.ARRAY(Sequelize.STRING)
      type: Sequelize.STRING // TODO: use postgresql instead
    },
    addresses: {
      //type: Sequelize.JSON
      type: Sequelize.STRING // TODO: use postgresql instead 
    }
  }, {
    freezeTableName: true
  });

  return contact;
};
