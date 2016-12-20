'use strict';

// division-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const division = sequelize.define('division', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    types: {
      // should be type: Sequelize.ARRAY(Sequelize.ENUM('Tiny Tigers', 'Children', 'Adult', 'Demo Team', 'Olympic Sparring'))
      // but the adapter does not support this yet.
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
    },
    dayOfTheWeek: {
      type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      allowNull: false
    },
    startTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    endTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {});

  return division;
};
