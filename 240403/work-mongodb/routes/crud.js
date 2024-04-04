const router = require('express').Router()
const { ObjectId, MongoClient } = require('mongodb')
const url = process.env.DB_URL

let db, posts
new MongoClient(url).connect().then((client) => {
	db = client.db('forum')
	posts = db.collection('posts')
	posts.createIndex({ title: "text" }, { content: "text" })
}).catch((err) => {
	console.log(err)
})

router.get('/posts', async (req, res) => {
	const { title, content } = req.query
	let result
	if (title != null) result = await posts.find({ title: { $regex: new RegExp(title) } }).toArray()
	else if (content != null) result = await posts.find({ content: { $regex: new RegExp(content) } }).toArray()
	else result = await posts.find().toArray()
	res.render('posts', { list: result, user: req.user })
})


router.get('/posts/write', (req, res) => {
	return res.render('write', { user: req.user })
})

router.get('/posts/:id', async (req, res) => {
	const { id } = req.params
	try {
		let result = await posts.findOne({ _id: new ObjectId(id) })
		if (result == null) return res.send('no result')
		return res.render('post', { user: req.user, result })
	} catch (error) {
		return res.send('error occured')
	}
})

router.post('/posts', async (req, res) => {
	let regex = /^[가-힣a-zA-Z0-9]{1,20}$/
	if (!regex.test(req.body.title)) return res.send('title fail')

	try {
		let result = await posts.insertOne(req.body)
		return res.send(result)
	} catch (error) {
		return res.send('error occured')
	}
})

router.get('/posts/:id/edit', async (req, res) => {
	const { id } = req.params
	let result = await posts.findOne({_id : new ObjectId(id)})

	res.render('edit', {post : result , user : req.user})
})

router.put('/posts/:id', async (req, res) => {
	const { id } = req.params
	const data = { $set: req.body }
	try {
		let result = await posts.updateOne({ _id: new ObjectId(id) }, data)
		return res.send(result)
	} catch (error) {
		return res.send('error occured')
	}
})

router.delete('/posts/:id', async (req, res) => {
	const { id } = req.params
	try {
		let result = await posts.deleteOne({ _id: new ObjectId(id) })
		return res.send(result)
	} catch (error) {
		return res.send('error occured')
	}
})

module.exports = router