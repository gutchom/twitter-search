require('colors')
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const account = JSON.stringify(require('./data/account.json'))

app.use('/assets', express.static('public'))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'pug')

app.use((req, res, next) => {
  console.log(`[server]: ${req.method} ${req.path.cyan} from ${req.ip.cyan}`)
  next()
})

app.route('/').get((req, res) => {
  res.render(`top.pug`)
})

app.route('/:page').get((req, res) => {
  res.render('app.pug', { name: req.params.page, account })
})

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('--------------------------'.magenta)
  console.log(' Local server has started'.magenta)
  console.log(` on ${`http://localhost:${String(server.address().port)}`.cyan}`.magenta)
  console.log('--------------------------'.magenta)
})
