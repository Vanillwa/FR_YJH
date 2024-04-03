const express = require('express')
const app = express()
const port = 8082
let members = require('./members')

app.use(express.json())
app.listen(port, () => {
	console.log('http://localhost:8082')
})

app.get("/", (req, res) => {
	res.send('우하하')
})

app.get("/api/members", (req, res) => {
	const { team, position } = req.query

	let list

	try {
		if (team && position) list = members.filter(m => m.team === team && m.position === position)
		else if (position) list = members.filter(m => m.position === position)
		else if (team) list = members.filter(m => m.team === team)
	} catch (error) {
		res.send(error)
	}

	if (list != null) return res.send(list)

	return res.send(members);
})

app.get("/api/members/:id", (req, res) => {
	const { id } = req.params
	const member = members.find(member => member.id === Number(id))
	member == null ? res.status(400) : res.send(member)
})

app.post("/api/members", (req,res)=>{
	const newMember = req.body
	members.push(newMember)
	return res.status(200).send("데이터 통신 완료!!")
})

app.put("/api/members/:id", (req,res)=>{
	const {id} = req.params
	const newInfo = req.body

	const member = members.find(m=>m.id === Number(id))

	if(member){
		Object.keys(newInfo).forEach(prop=>{
			if(newInfo[prop] != null){
				member[prop] = newInfo[prop]
			}	
		})
	}else{
		res.status(400).send("데이터 업데이트 실패!!")
	}

	res.status(200).send("데이터 업데이트 완료!!")
})

app.delete("/api/members/:id", (req,res)=>{
	const {id} = req.params

	let check = members.find(m=>m.id === Number(id))
	members = members.filter(m=>m.id !== Number(id))

	if(check){
		return res.status(200).send("삭제 완료!")
	}else{
		return res.status(400).send("삭제 실패!")
	}
})