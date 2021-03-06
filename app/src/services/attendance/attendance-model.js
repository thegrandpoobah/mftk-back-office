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
    },
    status: {
      type: Sequelize.ENUM(
        'Early',
        'On Time',
        'Late'
      ),
      allowNull: false
    }
  }, {
    classMethods: {
      associate() {
        attendance.belongsTo(sequelize.models.division, { as: 'division' });
        attendance.belongsTo(sequelize.models.student, { as: 'student' });
      }
    }
  });

  return attendance;
};
