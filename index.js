var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var mysql = require('mysql')
app.set('port', (process.env.PORT || 3000))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}))

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

var pool = mysql.createPool({
  // connectionLimit : 10,
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'std'
})

pool.getConnection(function (err, connection) {
  if (err) {
    console.log('error')
    return
  }
  console.log('connected as id ' + connection.threadId)
})

app.get('/data', function (req, res) {
  pool.query('select * from std', function (err, rows, fields) {
    if (err) throw err
    res.send(rows)
  })
})

app.post('/insert', jsonParser, function (req, res) {
  var post = {std_name: req.body.name, std_lastname: req.body.lastname}
  var insert = pool.query('INSERT INTO std SET ?', post, function (err, rows, fields) {
    if (err) throw err
  })
  res.send(insert)
})

// connection.end()

app.listen(app.get('port'), function () {
  console.log('Server Start at port ', app.get('port'))
})
