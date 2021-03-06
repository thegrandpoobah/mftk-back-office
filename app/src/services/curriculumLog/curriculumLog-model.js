'use strict';

// curriculumLog-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const curriculumLog = sequelize.define('curriculumLog', {
    poomsaeForms: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    appreciationForms: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    selfDefense: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    stepSparring: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    extra: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate() {
        curriculumLog.belongsTo(sequelize.models.division, { as: 'division' });
        curriculumLog.belongsTo(sequelize.models.student, { as: 'instructor' });
      }
    }
  });

  return curriculumLog;
};
