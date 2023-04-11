const path = require('path')

// встановлюємо express
const express = require('express')
const app = express()

// встановлюємо директорію для віддачі статичного контенту (каталог проекту)
app.use(express.static(__dirname))

// налаштовуємо роботу із шаблонізаотором
app.set('views', path.join(__dirname, '/static/views'))
app.set('view engine', 'pug')

// налаштовуємо маршрутизацію
app.get('/', function (request, response) {
  response.render('pages/index', { title: 'Home' })
})
app.get('/customer', function (request, response) {
  response.render('pages/customer', { title: 'Customer' })
})
app.get('/project', function (request, response) {
  response.render('pages/project', { title: 'Project' })
})
app.get('/executor', function (request, response) {
  response.render('pages/executor', { title: 'Executor' })
})
app.get('/runningproject', function (request, response) {
  response.render('pages/running_project', { title: 'Running Projects' })
})

// запускаємо аплікацію
app.listen(process.env.PORT || 8080)