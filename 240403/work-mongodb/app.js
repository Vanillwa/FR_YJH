require('dotenv').config()
const url = process.env.DB_URL
const port = process.env.PORT
const express = require('express')
const app = express()
const layout = require('express-ejs-layouts');

const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')

app.set('view engine', 'ejs')
app.use(layout)
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessionConfig = {
	secret: '1111',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 },
	store: MongoStore.create({
		mongoUrl: url,
		dbName: 'forum'
	})
}

app.use(passport.initialize());
app.use(session(sessionConfig))
app.use(passport.session());

app.use('/', require('./routes/crud'), require('./routes/auth'))

app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})

app.get('/', (req, res) => {
	res.render('index', { user: req.user })
})