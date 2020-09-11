const express = require('express')
const os = require('os')
const fs = require('fs')
const app = express()

const port = parseInt(process.env.PORT, 10) || 0
const message = process.env.MESSAGE

const version = '2.0'

if (!port) {
	console.log('Missing env PORT!')
	process.exit(1)
}

if (!message) {
	console.log('Missing env MESSAGE!')
	process.exit(1)
}

app.get('/', (req, res) => {
  res.send(`Hello, I'm running on ${os.hostname()} with version ${version}!`)
  res.send(`Message: ${message}`)
})

app.get('/config-env', (req, res) => {
  res.send(`Loaded config from env: ${process.env.CONFIG_ENV}`)
})

app.get('/secret-env', (req, res) => {
  res.send(`Loaded secret from env: ${process.env.SECRET_ENV}`)
})

app.get('/config-file', (req, res) => {
  res.send(`Loaded config from file:`)
  fs.readFile('./config.json', 'utf8', function(err, contents) {
    res.send(contents);
  });
})

app.get('/secret-file', (req, res) => {
  res.send(`Loaded secret from file:`)
  fs.readFile('./secret.json', 'utf8', function(err, contents) {
    res.send(contents);
  });
})

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`)
})
