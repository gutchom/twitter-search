require('colors')
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

const userInfo = JSON.stringify(require('./data/userInfo.json'))

app.use('/assets', express.static('public'))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  console.log('[server]: GET "/"'.cyan)
  res.render('search.pug', { userInfo })
})

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('--------------------------'.magenta)
  console.log(' Local server has started'.magenta)
  console.log(` on ${`http://localhost:${String(server.address().port)}`.cyan}`.magenta)
  console.log('--------------------------'.magenta)
})
