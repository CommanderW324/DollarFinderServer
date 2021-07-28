const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const token = require('jsonwebtoken')
const login = require('express').Router()
const cors = require('cors')
login.post('/', async (request, response) => {
    const content = request.body
    
    if(content.username === undefined) {
        return response.status(400).json({error: "Please send a name"})
      }
      if(content.password === undefined) {
        return response.status(400).json({error: "Please send a password"})
      } 
    const user = await User.findOne({username: content.username})
    
    if(!user) {
        return response.status(400).json({error:"Non-existing username"})
    } else if(user.active === false) {
        return response.status(400).json({error: "Non-activated, please go to the email and activate"})
    } else {
        const verify = await bcrypt.compare(content.password, user.password)
        
        if(verify) {
            const logintoken = token.sign({username: user.username, id: user.id, pass: content.password}, process.env.SECRET)
            try{
                user.logged = true
                user.logintoken = logintoken
                await user.save()
                return response.status(200).send(logintoken)
            } catch {
                return response.status(404).send({error: "cannot Login"})
            }
        } else {
            return response.status(400).json({
                error: 'wrong password'
            })
        }
    }
 
})
    module.exports = login