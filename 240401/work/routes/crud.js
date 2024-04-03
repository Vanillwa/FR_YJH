const router = require('express').Router()
const db = require('../models')
const { Member, User } = db;

router.get("/api/members", async (req, res) => {
  const { team, position } = req.query

  let list
  try {
    if (team && position) list = await Member.findAll({ where: { team, position } })
    else if (position) list = await Member.findAll({ where: { position } })
    else if (team) list = await Member.findAll({ where: { team } })
    else list = await Member.findAll({ order: [['id', 'desc']] });
  } catch (error) {
    res.send(error)
  }
  return res.send(list);
})

router.get("/api/members/:id", async (req, res) => {
  const { id } = req.params
  const member = await Member.findByPk(id)
  member == null ? res.status(400).send('올바르지 않은 id입니다!!!') : res.send(member)
})

router.post("/api/members", async (req, res) => {
  const newMember = req.body
  try {
    let member = await Member.create(newMember)
    return res.send(member)
  } catch (error) {
    return res.status(400).send("데이터 포스트 실패!!")
  }
})

router.put("/api/members/:id", async (req, res) => {
  const { id } = req.params
  const newInfo = req.body

  try {
    const result = await Member.update(newInfo, { where: { id } })
    return res.send(result)
  } catch (error) {
    return res.status(400).send("데이터 업데이트 실패!!")
  }
})

router.delete("/api/members/:id", async (req, res) => {
  const { id } = req.params

  try {
    const count = await Member.destroy({ where: { id } })
    return res.send(`${count}개 삭제 완료`)
  } catch (error) {
    return res.status(400).send("데이터 삭제 실패!!")
  }
})

module.exports = router