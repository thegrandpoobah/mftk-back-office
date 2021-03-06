var Aviator = require('aviator')
var _ = require('lodash')
var qwest = require('qwest')
var moment = require('moment')
var title = require('../title')
var $ = require('jquery')
require('eonasdan-bootstrap-datetimepicker')

require('handlebars/runtime')

qwest.setDefaultDataType('json')

var templates = {
  'attendance': require('./attendance.html.handlebars'),
  'email': require('./email.html.handlebars')
}

module.exports = {
  attendance: function (request) {
    title.set('Reports')

    let end = moment()
    let start = moment(end).subtract(27, 'days')

    if (request.queryParams.end) {
      end = moment(request.queryParams.end)
      start = moment(end).subtract(27, 'days')
    }

    start = moment(start).startOf('day')
    end = moment(end).endOf('day')

    qwest
      .get('/api/attendanceReports?startTime=' + start.format() + '&endTime=' + end.format())
      .then(function (xhr, r1) {
        /* TODO: This should be generalized.. this is MFTK specific at this point */
        let maxDemos = 0
        let maxSparring = 0

        for (let i = moment(start); i.valueOf() < end.valueOf(); i = i.add(1, 'days')) {
          switch (i.format('dd')) {
            case 'Fr':
              maxSparring++
              break
            case 'Sa':
              maxDemos++
              break
          }
        }

        r1.forEach(student => {
          let idx = 0

          let demos = 0
          let sparring = 0
          let regular = 0
          let instructor = 0

          student.attendance.forEach(a => {
            switch (a.divisionId) {
              case 11: // DEMO
                demos++
                break
              case 8: // SPARRING
              case 21: // SPARRING
                sparring++
                break
              case null:
                instructor++
                break
              default:
                regular++
                break
            }
          })

          student.statistics = {
            isDemoTeam: student.roles.indexOf('Demo Team') !== -1,
            isSparringTeam: student.roles.indexOf('Sparring') !== -1,
            isInstructor: student.roles.indexOf('Instructor') !== -1,
            demos: demos,
            sparring: sparring,
            instructor: instructor,
            regular: regular
          }
        })

        $('#spa-target').empty().html(templates['attendance']({
          startDate: end,
          demo: _.sortBy(r1.reduce((acc, student) => {
            if (student.statistics.demos < 3 && student.statistics.isDemoTeam) {
              acc.push(student)
            }

            return acc
          }, []), 'statistics.demos'),
          sparring: _.sortBy(r1.reduce((acc, student) => {
            if (student.statistics.sparring < 2 && student.statistics.isSparringTeam) {
              acc.push(student)
            }

            return acc
          }, []), 'statistics.sparring'),
          instructor: _.sortBy(r1.reduce((acc, student) => {
            if (student.statistics.instructor < 4 && student.statistics.isInstructor) {
              acc.push(student)
            }

            return acc
          }, []), 'statistics.instructor'),
          regular: _.sortBy(r1.reduce((acc, student) => {
            if (student.statistics.regular < 7) {
              acc.push(student)
            }

            return acc
          }, []), 'statistics.regular')
        }))

        $('.report-tabs a').click(function (e) {
          e.preventDefault()
          $(this).tab('show')
        })

        $('#dayPicker').datetimepicker({
          defaultDate: end.format(),
          format: 'MM/DD/YYYY'
        });

        $("#dayPicker").on("dp.change", function (e) {
          end = moment(e.date)

          Aviator.navigate('/admin/reports/attendance', {
            queryParams: {
              end: end.format()
            }
          })
        });
      })
  },
  emails: function (request) {
    title.set('Emails')

    qwest
      .get('/api/emailReport')
      .then(function (xhr, r1) {
        $('#spa-target').empty().html(templates['email'](r1))
      })
  }
}
