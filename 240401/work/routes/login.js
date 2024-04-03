const router = require('express').Router()
const db = require('../models')
const { Member, User } = db;
const bcrypt = require('bcrypt')
const passport = require('passport')

router.post('/login', (req, res) => {
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
  req.logout((error) => {
    console.log('로그아웃 완료')
    req.session.destroy()
    return res.redirect('/')
  })
})

module.exports = router