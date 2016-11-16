require('modernizr')

var Aviator = require('aviator')

require('../styles/main.scss')

Aviator.linkSelector = 'a.aviator'
Aviator.setRoutes({
  '/admin': {
    '/students': {
      target: require('./students'),
      '/': 'index',
      ':id': 'edit'
    },
    '/classes': {
      target: require('./classes'),
      '/': 'index',
      '/new': 'create',
      '/:id': {
        '/edit': 'edit',
        '/delete': 'delete' 
      }
    }
  },
  '/instructor-sign-in': {
    target: require('./instructor-sign-in'),
    '/': 'index'
  },
  '/student-sign-in': {
    target: require('./student-sign-in'),
    '/': 'index'
  }
})
Aviator.dispatch()
