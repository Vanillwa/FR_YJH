const express = require('express')
const app = express()
const db = require('./models')
const { Member, User } = db;
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local')
const MySQLStore = require('express-mysql-session')(session)
const layout = require('express-ejs-layouts');
const bcrypt = require('bcrypt')

const port = 8082
const dbConfig = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '1111',
  database: 'work'
}

const sessionConfig = {
  secret: '1111',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 },
  store: new MySQLStore(dbConfig)
}

app.set('view engine', 'ejs')
app.use(layout)
app.use(express.static(__dirname + '/public'))
app.use(passport.initialize())
app.use(session(sessionConfig))
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/", require('./routes/join'), require('./routes/login'), require('./routes/crud'))

passport.use(new localStrategy(async (username, password, cb) => { // cb == callback
  let result = await User.findOne({ where: { username } })
  if (!result) return cb(null, false, 'NoExist')
  if (await bcrypt.compare(password, result.password)) return cb(null, result)
  else return cb(null, false, 'PwdFail')
}))

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user.id, username: user.username, nickname: user.nickname })
  })
})

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user)
  })
})

app.listen(port, () => {
  console.log('http://localhost:8082')
})

// route --------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.render('main', { user: req.user })
})

app.get('/login', (req, res) => {
  res.render('login', { user: req.user })
})

app.get('/join', (req, res) => {
  res.render('join', { user: req.user })
})