'use strict';

const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const app = require('./app');

const sequelize = app.get('sequelize')
sequelize.sync().then(function() {
  app.services['api/students'].Model.addFullTextIndex();
  app.services['api/contacts'].Model.addFullTextIndex();
})

const port80forwarder = express()
port80forwarder.use(function (req, res, next) {
	return res.redirect('https://' + req.headers.host + req.url)
})
const httpServer = http.createServer(port80forwarder).listen(app.get('http_server_port'), function() {
	const host = httpServer.address().address
	const port = httpServer.address().port

	console.log(`MFTK Back Office Server listening at http://${host}:${port}`)
})

var options = {
	key: fs.readFileSync(app.get('private_key_file')),
	cert: fs.readFileSync(app.get('certificate_file'))
}

const httpsServer = https.createServer(options, app).listen(app.get('https_server_port'), function() {
	const host = httpsServer.address().address
	const port = httpsServer.address().port

	console.log(`MFTK Back Office Server listening at https://${host}:${port}`)
})
