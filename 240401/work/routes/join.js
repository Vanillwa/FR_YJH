const router = require('express').Router()
const db = require('../models')
const { Member, User } = db;
const bcrypt = require('bcrypt')

router.post('/join', async (req, res) => {
  const { username, nickname, password } = req.body
  const isDuplicatedUsername = await User.findOne({ where: { username } }) !== null ? true : false
  const isDuplicatedNickname = await User.findOne({ where: { nickname } }) !== null ? true : false

  if (isDuplicatedUsername && isDuplicatedNickname) return res.send('both')
  else if (isDuplicatedUsername) return res.send('username')
  else if (isDuplicatedNickname) return res.send('nickname')

  let data = {
    username,
    nickname,
    password: await bcrypt.hash(password, 10)
  }
  await User.create(data)
  return res.send('success')
})

module.exports = router