const User = require('../models/User.js')
const bcrypt = require('bcrypt')

const loginRouter = require('express').Router()

registerRouter.post('/', (request, response) => {
    const body = request.body
    
  
    if (body.username === undefined) {
      return response.status(400).json({ error: 'username missing' })
    }
    
  const verifyUser = User.findOne({username: body.username})
  .then(
      user => {
          return user === null ? false : bcrypt.compare(body.password, user.password)
      })
      .then(verified => {
          if(verified)
      })
  )
  module.exports = loginRouter