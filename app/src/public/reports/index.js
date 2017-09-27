var Aviator = require('aviator')
var qwest = require('qwest')
var moment = require('moment')
var title = require('../title')
var numeral = require('numeral')
var $ = require('jquery')
require('eonasdan-bootstrap-datetimepicker')

require('handlebars/runtime')

qwest.setDefaultDataType('json')

var templates = {
  'index': require('./index.html.handlebars')
}

module.exports = {
  index: function(request) {
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
      .then(function(xhr, r1) {
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

          student.attendance.forEach(a => {
            switch (a.divisionId) {
            case 11: // DEMO
              demos++
              break
            case 8: // SPARRING
              sparring++
              break
            default:
              regular++
              break
            }
          })

          student.statistics = {
            isDemoTeam: student.roles.indexOf('Demo Team') !== -1,
            isSparringTeam: student.roles.indexOf('Olympic Sparring') !== -1,
            demos: demos,
            sparring: sparring,
            regularAverage: regular/4
          }
        })

        $('#spa-target').empty().html(templates['index']({
          startDate: end,
          demo: r1.reduce((acc, student) => {
            if (student.statistics.demos < 4 && student.statistics.isDemoTeam) {
              acc.push(student)
            }
            
            return acc
          }, []),
          sparring: r1.reduce((acc, student) => {
            if (student.statistics.sparring < 2 && student.statistics.isSparringTeam) {
              acc.push(student)
            }
            
            return acc
          }, []),
          regular: r1.reduce((acc, student) => {
            if (student.statistics.regularAverage < 2) {
              acc.push(student)
            }

            return acc
          }, []),
        }))

        $('#dayPicker').datetimepicker({
          defaultDate: end.format(),
          format: 'MM/DD/YYYY'
        });

        $("#dayPicker").on("dp.change", function (e) {
            end = moment(e.date)

            Aviator.navigate('/admin/reports', { 
              queryParams: {
                end: end.format()
              }
            })
        });
      })
  }
}
