'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const middleware = require('./middleware');
const services = require('./services');
const sitemap = require('./sitemap.json');

const app = feathers();

function flattenSitemap(obj, prefix) {
  if (Object(obj) !== obj) {
    return []
  }

  let result = []

  Object
    .keys(obj)
    .forEach((k) => {
      result.push(prefix + k)
      result.push(...flattenSitemap(obj[k], prefix + k))
    })

  return result
}

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(cors())
  .use('/', serveStatic(app.get('public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)

flattenSitemap(sitemap, '').forEach((p) => {
  app.use(p, (req, res) => {
    res.sendFile(app.get('public') + '/index.html')
  })
})

app.configure(middleware)

module.exports = app;
