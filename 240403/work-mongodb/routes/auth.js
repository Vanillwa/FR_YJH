const url = process.env.DB_URL
const router = require('express').Router()
const passport = require('passport')
const localStrategy = require('passport-local')
const session = require('express-session')
const bcrypt = require('bcrypt')
const { ObjectId, MongoClient } = require('mongodb')

let db, users
new MongoClient(url).connect().then((client) => {
	db = client.db('forum')
	users = db.collection('users')
}).catch((err) => {
	console.log(err)
})

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

router.get('/login', (req, res)=>{
	res.render('login', {user : req.user})
})


router.post('/login', async (req, res, next) => {
	passport.authenticate('local', (error, user, info) => {
		if (error) return res.status(500).json(error)
		if (!user) return res.send(info)
		req.login(user, (error) => {
			if (error) return next(error)
			console.log('로그인 완료')
			return res.send('success')
		})
	})(req, res)
})

router.get('/logout', (req, res) => {
	req.logout(() => {
		console.log('로그아웃 완료')
		req.session.destroy()
		return res.redirect('/')
	})
})

router.get('/join', (req, res)=>{
	res.render('join', {user : req.user})
})

router.post('/join', async (req, res) => {
	const { username, password } = req.body

	let result = await users.findOne({ username })
	if (result) return res.send('duplicated')

	let data = {
		username,
		password: await bcrypt.hash(password, 10)
	}
	result = await users.insertOne(data)
	return res.send('success')
})

router.put('/user', async (req, res)=>{
	if(!req.user) return res.send('로그인을 하십셔')
	let result = await users.updateOne({_id : req.user._id}, req.body)
	return res.send(result)
})

module.exports = router