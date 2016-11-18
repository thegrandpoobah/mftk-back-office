require('modernizr')

var Aviator = require('aviator')

require('../styles/main.scss')

Aviator.linkSelector = 'a.aviator'
Aviator.setRoutes({
  '/admin': {
    '/accounts': {
      target: require('./accounts'),
      '/': 'index',
      'new': 'create',
      ':id': {
        '/edit': 'edit',
        '/notes': 'notes',
        '/delete': 'delete'
      }
    },
    '/students': {
      target: require('./students'),
      '/': 'index',
      '/new': 'create',
      '/:id': {
        '/edit': 'edit',
        '/attendance': 'attendance',
        '/notes': 'notes',
        '/delete': 'delete'
      }
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
  '/disciplinary-note': {
    target: require('./disciplinary-note'),
    '/': 'index',
    '/create': 'create'
  },
  '/curriculum-log': {
    target: require('./curriculum-log'),
    '/': 'index'
  },
  '/instructor-sign-in': {
    target: require('./instructor-sign-in'),
    '/': 'index'
  },
  '/student-sign-in': {
    target: require('./student-sign-in'),
    '/': 'index',
    '/sign-in': 'signIn'
  }
})
Aviator.dispatch()
