require('dotenv').config()
const url = process.env.DB_URL
const port = process.env.PORT
const express = require('express')
const app = express()
const cors = require('cors')
const layout = require('express-ejs-layouts');
const path = require("path");

const { ObjectId, MongoClient } = require('mongodb')
const MongoStore = require('connect-mongo')

const passport = require('passport')
const localStrategy = require('passport-local')
const session = require('express-session')
const bcrypt = require('bcrypt')

const { createServer } = require('http')
const { Server } = require('socket.io')
const server = createServer(app)
const io = new Server(server)

const sessionConfig = session({
	secret: '1111',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 },
	store: MongoStore.create({
		mongoUrl: url,
		dbName: 'forum'
	})
})

let db, users, posts, comments, chatroom, chatlog
new MongoClient(url).connect().then((client) => {
	db = client.db('forum')
	users = db.collection('users')
	posts = db.collection('posts')
	comments = db.collection('comments')
	chatroom = db.collection('chatroom')
	chatlog = db.collection('chatlog')
}).catch((err) => {
	console.log(err)
})

app.set('view engine', 'ejs')
app.use(cors({ origin: '*' }))
app.use(layout)
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(sessionConfig)
app.use(passport.session());

passport.use(new localStrategy(async (username, password, cb) => {
	let result = await users.findOne({ username })
	if (!result) return cb(null, false, { message: 'NoExist' })
	if (await bcrypt.compare(password, result.password)) return cb(null, result)
	return cb(null, false, { message: 'PwdFail' })
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

server.listen(port, () => {
	console.log(`http://localhost:${port}`)
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/build/index.html"));
});

// app.get('/login', (req, res) => {
// 	res.render('auth/login', { user: req.user })
// })

app.post('/api/login', async (req, res, next) => {
	passport.authenticate('local', (error, user, info) => {
		if (error) return res.status(500).json(error)
		if (!user) return res.send(info)
		req.login(user, (error) => {
			if (error) return next(error)
			console.log('로그인 완료')
			let userInfo = {
				userId : req.user._id,
				username : req.user.username
			}
			return res.send({ message: 'success', userInfo })
		})
	})(req, res)
})

app.get('/api/logout', (req, res) => {
	req.logout(() => {
		console.log('로그아웃 완료')
		req.session.destroy()
		return res.send('success')
	})
})

// app.get('/join', (req, res) => {
// 	res.render('auth/join', { user: req.user })
// })

app.post('/api/join', async (req, res) => {
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

// app.put('/user', async (req, res) => {
// 	if (!req.user) return res.send('로그인을 하십셔')
// 	let result = await users.updateOne({ _id: req.user.id }, req.body)
// 	return res.send(result)
// })


// -----------------------------------------------------------------------------------
app.get('/api/posts', async (req, res) => {
	const { title, content } = req.query
	let result
	if (title != null) result = await posts.find({ title: { $regex: new RegExp(title) } }).toArray()
	else if (content != null) result = await posts.find({ content: { $regex: new RegExp(content) } }).toArray()
	else result = await posts.find().sort({ _id: -1 }).toArray()
	return res.send({ list: result })
})

// app.get('/posts/write', (req, res) => {
// 	if (req.user == null) return res.redirect('/login')
// 	return res.render('post/write', { user: req.user })
// })

app.get('/api/posts/:id', async (req, res) => {
	const { id } = req.params
	try {
		let result = await posts.findOne({ _id: new ObjectId(id) })
		if (result == null) return res.send('no result')

		let commentList = await comments.find({ postId: id }).toArray()
		return res.send({post : result})
	} catch (error) {
		return res.send('error occured')
	}
})

app.post('/api/posts', async (req, res) => {
	if (!req.user) return res.send('NoAuth')
	let body = {
		title: req.body.title,
		content: req.body.content,
		date : req.body.date,
		userInfo : req.user
	}
	console.log(body)
	try {
		let result = await posts.insertOne(body)
		return res.send(result)
	} catch (error) {
		return res.send('error occured')
	}
})

// app.get('/posts/:id/edit', async (req, res) => {
// 	const { id } = req.params
// 	let result = await posts.findOne({ _id: new ObjectId(id) })

// 	res.render('post/edit', { post: result, user: req.user })
// })

// app.put('/posts/:id', async (req, res) => {
// 	const { id } = req.params
// 	const data = { $set: req.body }
// 	try {
// 		let result = await posts.updateOne({ _id: new ObjectId(id) }, data)
// 		return res.send(result)
// 	} catch (error) {
// 		return res.send('error occured')
// 	}
// })

// app.delete('/posts/:id', async (req, res) => {
// 	const postId = req.params.id
// 	const userId = req.user.id
// 	try {
// 		let result = await posts.deleteOne({ _id: new ObjectId(postId), userId })
// 		console.log(result)
// 		return res.send(result.deletedCount > 0 ? 'success' : 'fail')
// 	} catch (error) {
// 		return res.send('error occured')
// 	}
// })


// --------------------------------------
// app.post('/comment', async (req, res) => {
// 	let body = {
// 		content: req.body.content,
// 		postId: req.body.postId,
// 		userId: req.user.id,
// 		username: req.user.username
// 	}
// 	let result = await comments.insertOne(body)
// 	return res.send('success')
// })

//-------------------------------------------

// app.get('/chat/list', async (req, res) => {
// 	let result = await chatroom.find({ member: req.user }).toArray()
// 	return res.render('chat/chatList', { result, user: req.user })
// })

// app.get('/chat/request', async (req, res) => {
// 	let { targetId } = req.query
// 	if (!req.user) return res.redirect('/login')
// 	if (req.user.id == targetId) return res.redirect('/')

// 	let targetUser = await users.findOne({ _id: new ObjectId(targetId) })
// 	let newUser = {
// 		id: targetUser._id.toString(),
// 		username: targetUser.username
// 	}
// 	let check = await chatroom.findOne({ member: { $all: [req.user, newUser] } });
// 	if (check != null) {
// 		return res.redirect(`/chat/${check._id}`)
// 	}
// 	let result = await chatroom.insertOne({
// 		member: [req.user, newUser],
// 		date: new Date()
// 	})
// 	console.log(result)
// 	return res.redirect(`/chat/${result.insertedId}`)
// })

// app.get('/chat/:id', async (req, res) => {
// 	const { id } = req.params
// 	let roomInfo = await chatroom.findOne({ _id: new ObjectId(id) })
// 	let chatlogs = await chatlog.find({ roomId: id }).toArray()
// 	return res.render('chat/chat', { user: req.user, roomInfo, chatlogs })
// })


// ------------------------------------------------------------------------

function onlyForHandshake(middleware) {
	return (req, res, next) => {
		const isHandshake = req._query.sid === undefined;
		if (isHandshake) {
			middleware(req, res, next);
		} else {
			next();
		}
	};
}

io.engine.use(onlyForHandshake(sessionConfig));
io.engine.use(onlyForHandshake(passport.session()));
io.engine.use(
	onlyForHandshake((req, res, next) => {
		if (req.user) {
			next();
		} else {
			res.writeHead(401);
			res.end();
		}
	}),
);

io.on('connection', (socket) => {
	console.log('socket connected')

	socket.on('ask-join', async (data) => {
		io.emit('message', '채팅방에 입장하셨습니다.')
		socket.join(data)
	})

	socket.on('message-send', async (data) => {
		data.user = socket.request.user
		console.log(data)
		await chatlog.insertOne(data)
		io.to(data.roomId).emit('message-broadcast', data)
	})
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});