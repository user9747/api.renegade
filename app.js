var express = require('express')
var app = express()

//test file
app.get('/', function (req, res) {
  res.send('Hello Renegades!')
})

app.listen(3000, function () {
  console.log('App started on port 3000')
})
