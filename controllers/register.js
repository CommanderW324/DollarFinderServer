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
  const confirmationCode = token.sign({email: content.email}, process.env.SECRET)
 let newUser = new User({
     username: content.username,
     email: content.email,
     password: password_hashed,
     active: false,
     confirmationCode: confirmationCode,
     posts: []
   })
   await User.create(newUser)
   
   let transport = nodeMailer.createTransport({
     service:"Gmail",
     auth:{
       user: process.env.senderEmail,
       pass: process.env.senderPassword
     }
   })
   const confirmationLink = process.env.Homepage + "/register/" + confirmationCode 
   let message = {
    from: process.env.senderEmail,
    to: content.email,
    subject: "Verification for $Finder",
    text: "Please verify your account ! follow the following link" + confirmationLink,
    html: "<p>Please verify your account ! follow the following link " + confirmationLink + "</p>"
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
  const userEmail = verification.email
  const user = await User.findOne({email: userEmail})
  
  if(!user) {
      return response.status(401).send({error: "wrong Token"})
  } else {
    try{
      user.active = true
      await user.save()
    } catch {
      return response.status(404).send({error: "cannot update"})
    }
    
  }
  return response. status(200).end()
  })
  register.post('/forgot', async (request, response) => {
    let content = request.body
    let foundUser = User.findOne({email: content.email })
    let forgotCode = token.sign({email: content.email}, process.env.SECRETCODE)
    let password_hashed = await bcrypt.hash(forgotCode, 10)
    if(!foundUser) {
        return response.status(401).send({error: "wrong Token"})
    } else {
      const update = await User.updateOne({email: content.email}, {
        password: password_hashed
      })
    }
      
    
    let transport = nodeMailer.createTransport({
      service:"Gmail",
      auth:{
        user: process.env.senderEmail,
        pass: process.env.senderPassword
      }
    })

    const confirmationLink = process.env.Homepage + "/register/forgot" + forgotCode
    let message = {
     from: process.env.senderEmail,
     to: content.email,
     subject: "Password Reset",
     text: "Change your password using the following new password",
     html: "<p>Change your password by logging in using this new password :  " + forgotCode + "</p>"
   };
   
   try{
     transport.sendMail(message)
   } catch {
     return response.status(404).end()
   }
    
      return response.status(200).end()
  })
// register.post('/forgot/:forgotCode', async (request, response) => {
//     const code = request.params.forgotCode
//     const newPassword = request.password
//   let verification
//   try {
//     verification = token.verify(code, process.env.SECRETCODE)
//   } catch {
//     return response.status(401).send({error: "Invalid Link"})
//   }
//   const userEmail = verification.email
//   const user = await User.findOne({email: userEmail})
//   if(!user) {
//       return response.status(401).send({error: "wrong Token"})
//   } else {
//     const update = await User.updateOne({email: userEmail}, {
//       password: code
//     })
//   }
//   return response. status(200).end()
//   })

  module.exports = register
