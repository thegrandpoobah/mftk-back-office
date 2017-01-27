'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.describeTable('divisions').then(attributes => {
      if (attributes.timezone) {
        return
      }

      return queryInterface.addColumn('divisions', 'timezone', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'America/Toronto'
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.describeTable('divisions').then(attributes => {
      if (!attributes.timezone) {
        return
      }

      return queryInterface.removeColumn('divisions', 'timezone')
    })
  }
}
