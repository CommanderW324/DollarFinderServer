const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const register = require('express').Router()

register.post('/', (request, response) => {
 
    const content = request.body
      if(content.username === undefined) {
        return response.status(400).json({error: "Please send a name"})
      }
      if(content.email === undefined) {
        return response.status(400).json({error: "Please send an email"})
      }
      if(content.password === undefined) {
        return response.status(400).json({error: "Please send a password"})
      } 
    
  const password_hashed = bcrypt.hash(content.password, 10).then(hashed => {
    const newUser = new User({
      username: content.username,
      email: content.email,
      password: hashed
    })
      newUser.save().then(savedUser => {
      response.status(200)
    })
  })
  })

  module.exports = register
