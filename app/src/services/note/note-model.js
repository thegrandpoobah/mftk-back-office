'use strict';

// note-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const note = sequelize.define('note', {
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        note.belongsTo(models.student, { as: 'instructor' });
      }
    }
  });

  return note;
};
