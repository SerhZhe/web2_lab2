const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 8080
app.use(express.static(__dirname))

app.set('views', path.join(__dirname, '/static/views/'))
app.set('view engine', 'pug')

app.get('/', function (request, response) {
  response.render('pages/index', { title: 'Home' })
})
app.get('/shop', function (request, response) {
  response.render('pages/shop', { title: 'Shop' })
})
app.get('/product', function (request, response) {
  response.render('pages/product', { title: 'Product' })
})
app.get('/stock', function (request, response) {
  response.render('pages/stock', { title: 'Stock' })
})
app.get('/productStock', function (request, response) {
  response.render('pages/productStock', { title: 'Product in stock' })
})
app.listen(port)
console.log(port)
