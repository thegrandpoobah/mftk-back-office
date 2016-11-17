'use strict';

// student-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const student = sequelize.define('student', {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    dateOfBirth: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    rank: {
      type: Sequelize.ENUM(
        'White',
        'Yellow Stripe',
        'Yellow',
        'Orange Stripe',
        'Orange',
        'Green Stripe',
        'Green',
        'Purple',
        'Blue',
        'Brown',
        'Red',
        'Black Tip',
        'Poomdae',
        '1st Dan Black Belt',
        '2nd Dan Black Belt',
        '3rd Dan Black Belt',
        '4th Dan Black Belt',
        '5th Dan Black Belt',
        '6th Dan Black Belt',
        '7th Dan Black Belt',
        '8th Dan Black Belt',
        '9th Dan Black Belt'
      )
    },
    roles: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        student.belongsTo(models.account);
        student.hasMany(models.attendance, { as: 'attendance' });
        student.hasMany(models.note, { as: 'notes' });
      }
    }
  });

  return student;
};
