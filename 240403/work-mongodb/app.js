require('dotenv').config()
const port = process.env.PORT
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', require('./routes/crud'), require('./routes/auth'))

app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})

app.get('/', (req, res) => {
	res.send('main')
})

app.get('/user', (req, res) => {
	return res.send(req.user)
})



