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

const statusRank = {
  'Early': 3,
  'On Time': 2,
  'Late': 1
}

module.exports = {
  index: function(request) {
    title.set('Reports')

    let start = moment().startOf('month')
    let end = moment().endOf('month')

    if (request.queryParams.end) {
      end = moment(request.queryParams.end)
      start = moment(end).subtract(1, 'months')
    }

    if (request.queryParams.start) {
      start = moment(request.queryParams.start)
    }

    start = moment(start).startOf('day')
    end = moment(end).endOf('day')

    qwest
      .get('/api/attendanceReports?startTime=' + start.format() + '&endTime=' + end.format())
      .then(function(xhr, r1) {
        let days = []

        /* TODO: This should be generalized.. this is MFTK specific at this point */
        let maxDemos = 0
        let maxSparring = 0

        for (let i = moment(start); i.valueOf() < end.valueOf(); i = i.add(1, 'days')) { 
          days.push(moment(i))

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
            demos: demos,
            sparring: sparring,
            regularAverage: numeral(regular / (days.length / 7)).format('0.0')
          }

          student.attendance = days.map(d => {
            if (idx < student.attendance.length) {
              if (moment(student.attendance[idx].signInTime).valueOf() > moment(d).endOf('day').valueOf()) {
                return {absent: true}
              } else {
                let v = student.attendance[idx]
                let bestRank = statusRank[v.status]

                for (v.count = 1, idx++; idx < student.attendance.length && moment(student.attendance[idx].signInTime).valueOf() < moment(d).endOf('day').valueOf(); idx++) {
                  bestRank = Math.max(bestRank, statusRank[student.attendance[idx].status])
                  v.count++
                }

                if (v.count > 1) {
                  v.multiple = true
                }

                switch (bestRank) {
                  case 3:
                    v.colour = '#5CB85C'
                    break
                  case 2:
                    v.colour = '#F0AD4E'
                    break
                  case 1:
                    v.colour = '#D9534F'
                    break
                  default:
                    v.colour = '#777'
                    break
                }

                return v
              }
            } else {
              return null
            }
          })        
        })

        $('#spa-target').empty().html(templates['index']({
          days: days,
          data: r1,
          maxDemos: maxDemos,
          maxSparring: maxSparring
        }))

        $('#startPicker').datetimepicker({
          defaultDate: start.format(),
          format: 'MM/DD/YYYY'
        });
        $('#startPicker').data("DateTimePicker").maxDate(end.toDate());

        $('#endPicker').datetimepicker({
          defaultDate: end.format(),
          format: 'MM/DD/YYYY',  
          useCurrent: false //Important! See issue #1075
        });
        $('#endPicker').data("DateTimePicker").minDate(start.toDate());

        $("#startPicker").on("dp.change", function (e) {
            start = moment(e.date)

            Aviator.navigate('/admin/reports', { 
              queryParams: {
                start: start.format(),
                end: end.format()
              }
            })
        });
        $("#endPicker").on("dp.change", function (e) {
            end = moment(e.date)

            Aviator.navigate('/admin/reports', { 
              queryParams: {
                start: start.format(),
                end: end.format()
              }
            })
        });
      })
  }
}