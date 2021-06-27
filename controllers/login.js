const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const token = require('jsonwebtoken')
const loginRouter = require('express').Router()

loginRouter.post('/', (request, response) => {
    const body = request.body
    
  
    if (body.username === undefined) {
      return response.status(400).json({ error: 'username missing' })
    }
    
  const verifyUser = User.findOne({username: body.username})
  .then(
      user => {
          return user === null ? false : bcrypt.compare(body.password, user.password).then(verified => {
            if(verified) {
                const logintoken = token.sign({username: user.username, id: user.__id}, process.env.SECRET)
                return response.status(200).json({success: 'You logged in', logintoken})
            } else {
                return response.status(400).json({
                    error: 'non existing username/wrong password'
                })
            }
        })
    })
})
    module.exports = loginRouter