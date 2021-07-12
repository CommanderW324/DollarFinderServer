const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const token = require('jsonwebtoken')
const login = require('express').Router()
const cors = require('cors')
login.post('/', (request, response) => {
    const content = request.body
    
    if(content.username === undefined) {
        return response.status(400).json({error: "Please send a name"})
      }
      if(content.password === undefined) {
        return response.status(400).json({error: "Please send a password"})
      } 
    
  const verifyUser = User.findOne({username: content.username})
  .then(
      user => {
          return user === null ? response.status(400).json({error: "Non-existing username"}) : (!user.active) ? response.status(400).json({error: "Non-activated, please go to email and activate"}) : bcrypt.compare(content.password, user.password).then(verified => {
            if(verified) {
                const logintoken = token.sign({username: user.username, id: user.__id}, process.env.SECRET)
                return response.status(200).json({success: 'You logged in',
                logintoken})
            } else {
                return response.status(400).json({
                    error: 'wrong password'
                })
            }
        })
        // return response.status(200).json(user)
    })
})
    module.exports = login