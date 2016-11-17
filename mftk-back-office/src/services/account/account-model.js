'use strict';

// account-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const account = sequelize.define('account', {
    active: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        account.hasMany(models.contact, { as: 'contacts' });
        account.hasMany(models.student, { as: 'students' });
        account.hasMany(models.note, { as: 'notes' });
      }
    }
  });

  return account;
};
