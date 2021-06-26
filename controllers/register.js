const User = require('../models/User.js')
const bcrypt = require('bcrypt')

const registerRouter = require('express').Router()

registerRouter.post('/', (request, response) => {
    const body = request.body
    
  
    if (body.username === undefined) {
      return response.status(400).json({ error: 'username missing' })
    }
    
  const password_hashed = bcrypt.hash(body.password, 10).then(hashed => {
    const newUser = new User({
      username: body.username,
      email: body.email,
      password: hashed,
    })
    newUser.save().then(savedUser => {
      response.json(savedUser)
    })
  })
  })

  module.exports = registerRouter
