const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const register = require('express').Router()

register.post('/', async (request, response) => {
 
    const content = request.body
    
  //     if(content.username === undefined) {
  //       return response.status(400).json({error: "Please send a name"})
  //     }
  //     if(content.email === undefined) {
  //       return response.status(400).json({error: "Please send an email"})
  //     }
  //     if(content.password === undefined) {
  //       return response.status(400).json({error: "Please send a password"})
  //     } 
    
  const password_hashed = await bcrypt.hash(content.password, 10)
   const newUser = new User({
       username: content.username,
       email: content.email,
       password: password_hashed,
     })
     User.create(newUser)
     return response.status(200).json(newUser)
  // })
  })

  module.exports = register
