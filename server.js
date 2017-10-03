require('colors')
const express = require('express')
const app = express()

app.use(express.static('public'))

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('--------------------------'.magenta)
  console.log(' Local server has started'.magenta)
  console.log(` on ${`http://localhost:${String(server.address().port)}`.cyan}`.magenta)
  console.log('--------------------------'.magenta)
})
