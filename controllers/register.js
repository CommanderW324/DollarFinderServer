const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const register = require('express').Router()
const token = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
register.post('/', async (request, response) => {
 
  let content = request.body
  
    // if(content.username === undefined) {
    //   return response.status(400).json({error: "Please send a name"})
    // }
    // if(content.email === undefined) {
    //   return response.status(400).json({error: "Please send an email"})
    // }
    // if(content.password === undefined) {
    //   return response.status(400).json({error: "Please send a password"})
    // } 
  
  let password_hashed = await bcrypt.hash(content.password, 10)
  const confirmationCode = token.sign({username: content.email}, process.env.SECRET)
 let newUser = new User({
     username: content.username,
     email: content.email,
     password: password_hashed,
     active: false,
     confirmationCode: confirmationCode
   })
   await User.create(newUser)
   
   let transport = nodeMailer.createTransport({
     service:"Gmail",
     auth:{
       user: process.env.senderEmail,
       pass: process.env.senderPassword
     }
   })
   const confirmationLink = "localhost:3001/register/" + confirmationCode 
   let message = {
    from: process.env.senderEmail,
    to: content.email,
    subject: "Verification for $Finder",
    text: "Please verify your account ! follow the following link" + confirmationLink,
    html: "<p>Please verify your account ! follow the following link" + confirmationLink + "</p>"
  };
  try{
    transport.sendMail(message)
  } catch {
    return response.status(404).end()
  }
   
     return response.status(200).end()
// })
})
register.get('/:confirmationCode', async (request, response) => {
  const code = request.params.confirmationCode
  let verification
  try {
    verification = token.verify(code, process.env.SECRET)
  } catch {
    return response.status(401).send({error: "Invalid Link"})
  }
  const userId = verification.id
  const user = await User.findOne({id: userId})
  if(!user) {
      return response.status(401).send({error: "wrong Token"})
  } else {
    const update = await User.updateOne({id: userId}, {
      active: true
    })
  }
  return response. status(200).end()
  })

  module.exports = register
