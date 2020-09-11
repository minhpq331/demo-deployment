const express = require('express')
const os = require('os')
const fs = require('fs')
const path = require('path')
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
  try {
  	const content = fs.readFileSync(path.resolve('./config.json'))
  	res.send(`Loaded config from file: \n` + content)
  } catch (error) {
  	res.send(error)
  }
})

app.get('/secret-file', (req, res) => {
  try {
  	const content = fs.readFileSync(path.resolve('./secret.json'))
  	res.send(`Loaded secret from file: \n` + content)
  } catch (error) {
  	res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`)
})
