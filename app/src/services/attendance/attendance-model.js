'use strict';

// attendance-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const attendance = sequelize.define('attendance', {
    signInTime: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        attendance.belongsTo(models.division, { as: 'division' });
        attendance.belongsTo(models.student, { as: 'student' });
      }
    }
  });

  return attendance;
};
