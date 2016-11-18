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
    gender: {
      type: Sequelize.ENUM('Male', 'Female'),
      allowNull: false
    },
    emails: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    phones: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    addresses: {
      type: Sequelize.JSON
    }
  }, {
    freezeTableName: true
  });

  return contact;
};
