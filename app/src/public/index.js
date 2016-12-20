require('modernizr')

var _ = require('lodash')
var Aviator = require('aviator')

require('font-awesome-webpack')
require('./styles/main.scss')
var sitemap = require('../sitemap.json')

Aviator.linkSelector = 'a.aviator'
Aviator.setRoutes(_.defaultsDeep(sitemap, {
  '/admin': {
    '/accounts': {
      target: require('./accounts')
    },
    '/students': {
      target: require('./students')
    },
    '/classes': {
      target: require('./classes')
    }
  },
  '/disciplinary-note': {
    target: require('./disciplinary-note')
  },
  '/curriculum-log': {
    target: require('./curriculum-log')
  },
  '/instructor-sign-in': {
    target: require('./instructor-sign-in')
  },
  '/student-sign-in': {
    target: require('./student-sign-in')
  }
}))
Aviator.dispatch()
