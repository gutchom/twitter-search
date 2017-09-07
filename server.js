require('colors')
const { resolve } = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', express.static(resolve(__dirname, './public')))
app.set('views', resolve(__dirname, './src/views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/index.pug')
})

app.listen(app.get('port'), () => {
  console.log('Server started: ' + `http://localhost:${String(app.get('port'))}`.cyan)
})
