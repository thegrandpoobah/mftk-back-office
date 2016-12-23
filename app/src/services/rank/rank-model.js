'use strict';

// rank-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const rank = sequelize.define('rank', {
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
    promotedOn: {
      type: Sequelize.DATEONLY,
      allowNull: false
    }
  });

  return rank;
};
