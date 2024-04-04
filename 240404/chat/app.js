//환경변수
require('dotenv').config()
const db_url = process.env.DB_URL
const port = process.env.PORT

//Express
const express = require('express')
const app = express()

//Auth
const passport = require('passport')
const localStrategy = require('passport-local')
const session = require('express-session')
const bcrypt = require('bcrypt')

//DB
const { ObjectId, MongoClient } = require('mongodb')
const MongoStore = require('connect-mongo')

let db, users, chatroom
new MongoClient(db_url).connect().then((client) => {
	db = client.db('forum')
	users = db.collection('users')
	chatroom = db.collection('chatroom')
}).catch((err) => {
	console.log(err)
})

const sessionConfig = {
	secret: '1111',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 },
	store: MongoStore.create({
		mongoUrl: db_url,
		dbName: 'forum'
	})
}

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())
app.use(session(sessionConfig))
app.use(passport.session())

passport.use(new localStrategy(async (username, password, cb) => {
	let result = await users.findOne({ username })
	if (!result) return cb(null, false, 'NoExist')
	if (await bcrypt.compare(password, result.password)) return cb(null, result)
	return cb(null, false, 'PwdFail')
}))

passport.serializeUser((user, done) => {
	process.nextTick(() => {
		done(null, { id: user._id, username: user.username })
	})
})

passport.deserializeUser((user, done) => {
	process.nextTick(() => {
		return done(null, user)
	})
})

app.listen(port, ()=>{
	console.log(`http://localhost:${port}`)
})

app.get('/', (req, res)=>{
	res.send('main')
})

app.get('/chat', (req,res)=>{
	res.render('chat')
})

app.get('/chat/request', async (req, res)=>{
	const {writerId} = req.query

	await chatroom.insertOne({
		member : [ req.user._id, new ObjectId(writerId)],
		date : new Date()
	})
})