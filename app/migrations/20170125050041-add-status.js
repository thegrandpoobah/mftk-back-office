'use strict';

const moment = require('moment-timezone')

const options = {
  early_threshold: -3,
  late_threshold: 2
};

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.describeTable('attendances').then(attributes => {
      if (attributes.status) {
        return
      }

      return queryInterface.addColumn('attendances', 'status', {
        type: Sequelize.ENUM(
          'Early',
          'On Time',
          'Late'
        ),
        defaultValue: 'On Time',
        allowNull: false
      }).then(() => {
        return queryInterface.sequelize.query('SELECT a."id", a."signInTime", d."startTime" FROM attendances a INNER JOIN divisions d on a."divisionId" = d."id"', { type: queryInterface.sequelize.QueryTypes.SELECT }).then(results => {
          const updates = [];

          results.forEach(r => {
            const signInTime = moment.tz(r.signInTime, 'America/Toronto')
            const signInTimeMinutes = signInTime.diff(signInTime.clone().startOf('day'), 'minutes')

            const delta = signInTimeMinutes - r.startTime

            if (delta < options.early_threshold) {
              r.status = 'Early'
            } else if (delta >= options.early_threshold && delta <= options.late_threshold) {
              r.status = 'On Time'
            } else if (delta > options.late_threshold) {
              r.status = 'Late'
            }

            updates.push(queryInterface.sequelize.query(`UPDATE attendances SET status = '${r.status}' WHERE id = ${r.id}`))
          })

          return Promise.all(updates)
        })
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.describeTable('attendances').then(attributes => {
      if (!attributes.status) {
        return
      }

      return queryInterface.removeColumn('attendances', 'status').then(() => {
        return queryInterface.sequelize.query('DROP TYPE public.enum_attendances_status;')
      })
    })
  }
}
